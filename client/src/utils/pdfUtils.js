import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Costanti ---
const COLORS = {
    purple: [124, 58, 237],
    blue: [37, 99, 235],
    gray: [80, 80, 80],
};

const MARGIN = { left: 18, top: 16, right: 18, bottom: 16 };

// --- Helper ---
function safeGetLS(key, def = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : def;
    } catch {
        return def;
    }
}

function formatEuro(value) {
    const num = Number(value || 0);
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
    }).format(num);
}

// --- Funzione principale ---
export function generateInvoicePDF(invoice) {
    const supplier = safeGetLS("fatturiamo.supplier", null);

    const numero = invoice?.numeroFattura || invoice?.numero || "N/D";
    const dataFattura =
        invoice?.data || invoice?.dataFattura || new Date().toLocaleDateString("it-IT");
    const cliente = invoice?.cliente || {};
    const righe = Array.isArray(invoice?.prodotti) ? invoice.prodotti : [];

    // Totali
    const imponibile = Number(invoice?.imponibile || 0);
    const iva = Number(invoice?.iva || 0);
    const totale = invoice?.totale != null ? Number(invoice.totale) : imponibile + iva;

    // Altri dati
    const terminiPagamento =
        invoice?.terminiPagamento || "Pagamento a 30 giorni data fattura";
    const metodoPagamento = invoice?.metodoPagamento || "Bonifico bancario";
    const iban = supplier?.iban || invoice?.iban || "";
    const sdi = supplier?.sdi || invoice?.sdi || "";
    const pec = supplier?.pec || supplier?.email || "";
    const cfFornitore = supplier?.cf || "";
    const regimeFiscale = supplier?.regimeFiscale || "";

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Disegno intestazioni e contenuti
    drawHeader(doc, { numero, dataFattura }, supplier);

    let cursorY = 140;
    cursorY = drawSupplierBox(doc, supplier, cursorY, dataFattura);
    cursorY = drawClientBox(doc, cliente, cursorY, dataFattura);
    cursorY = drawInvoiceInfoBox(
        doc,
        { numero, dataFattura, terminiPagamento, metodoPagamento, iban, sdi, pec, cfFornitore, regimeFiscale },
        cursorY
    );
    cursorY = drawItemsTable(doc, righe, cursorY);
    cursorY = drawTotals(
        doc,
        { imponibile, iva, totale, aliquotaIva: invoice?.aliquotaIva || 0 },
        cursorY
    );

    // Calcolo posizionamento basso per la sezione "dati pagamento"
    const tableEndY = cursorY;
    const paySectionHeight = 60;
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginAboveFooter = 100;
    const paySectionY = Math.max(
        tableEndY + 20,
        pageHeight - marginAboveFooter - paySectionHeight
    );

    drawPayToSection(doc, supplier, invoice, paySectionY);
    drawFooter(doc, supplier);

    const clienteNome = (cliente?.nome || cliente?.denominazione || "cliente")
        .toString()
        .replace(/[/\\<>:"|?*]+/g, "_");

    const filename = `Fattura_${numero}_${clienteNome}.pdf`;
    doc.save(filename);
}

// --- Header ---
function drawHeader(doc, { numero, dataFattura }, supplier) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoSize = 64;

    // Logo a sinistra
    if (supplier?.logoDataUrl) {
        try {
            doc.addImage(
                supplier.logoDataUrl,
                "PNG",
                MARGIN.left,
                MARGIN.top,
                logoSize,
                logoSize
            );
        } catch {
            console.warn("Logo non valido");
        }
    }

    // Dati testata a destra
    const rightX = pageWidth - MARGIN.right;
    const topY = MARGIN.top + 8;

    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.setTextColor(20);
    doc.text(supplier?.ragioneSociale || "Nome Azienda", rightX, topY + 4, {
        align: "right",
    });

    doc.setFontSize(14);
    doc.setFont(undefined, "normal");
    doc.setTextColor(80);
    doc.text(`Fattura n. ${numero}`, rightX, topY + 24, { align: "right" });
    doc.text(`Data: ${dataFattura}`, rightX, topY + 40, { align: "right" });

    // Linea separatrice
    const lineY = MARGIN.top + logoSize + 12;
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(MARGIN.left, lineY, rightX, lineY);
}

// --- Box Fornitore ---
function drawSupplierBox(doc, supplier, startY) {
    return startY; // se vuoi aggiungere dati fornitore dettagliati, li metti qui
}

// --- Box Cliente ---
function drawClientBox(doc, cliente, startY, dataFattura) {
    let y = Math.max(startY + 20, 120);

    // Data della fattura
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("DATA:", MARGIN.left, y);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.setTextColor(20);
    doc.text(String(dataFattura), MARGIN.left + 70, y);

    y += 40;

    // Etichetta
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("FATTURATO A:", MARGIN.left, y);

    // Dati cliente
    y += 18;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.setTextColor(20);

    const clienteLines = [
        cliente?.nome || cliente?.denominazione || "",
        cliente?.indirizzo || "",
        cliente?.cap && cliente?.citta ? `${cliente.cap} ${cliente.citta}` : "",
        cliente?.piva ? `P.IVA: ${cliente.piva}` : "",
        cliente?.cf ? `CF: ${cliente.cf}` : "",
        cliente?.email || cliente?.pec || "",
    ].filter(Boolean);

    clienteLines.forEach((line, i) => {
        doc.text(line, MARGIN.left, y + i * 12);
    });

    y += clienteLines.length * 12 + 16;
    return y + 20;
}

// --- Box Info Fattura / Pagamenti ---
function drawInvoiceInfoBox(doc, info, startY) {
    return startY + 4; // spaziatura minima
}

// --- Tabella righe ---
function drawItemsTable(doc, righe, startY) {
    const head = [["Descrizione", "Tariffa", "Ore", "Importo"]];

    const body = (righe || []).map((r) => {
        const ore = Number(r.ore ?? r.quantita ?? 0);
        const tariffa = Number(r.tariffa ?? r.tariffaOraria ?? r.prezzo ?? 0);
        const importo = ore * tariffa;

        const labelTariffa =
            ore && r.ore !== undefined ? `${formatEuro(tariffa)}/h` : formatEuro(tariffa);

        return [r.descrizione || "", labelTariffa, String(ore), formatEuro(importo)];
    });

    autoTable(doc, {
        startY: startY + 10,
        head,
        body,
        theme: "grid",
        margin: "auto",
        tableWidth: "auto",
        styles: {
            fontSize: 12,
            textColor: [20, 20, 20],
            lineWidth: 0.5,
            lineColor: [180, 180, 180],
            valign: "middle",
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            halign: "center",
        },
        columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
        },
    });

    return (doc.lastAutoTable?.finalY || startY + 100) + 10;
}

// --- Totali ---
function drawTotals(doc, totals, startY) {
    const { imponibile, iva, totale, aliquotaIva } = totals;
    const W = doc.internal.pageSize.getWidth();
    const xRight = W - MARGIN.right;
    let y = startY + 8;

    doc.setDrawColor(200);
    doc.line(W - 260 - MARGIN.right, y, xRight, y);
    y += 12;

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.setFont(undefined, "normal");
    doc.text("Sub-Totale", xRight - 120, y, { align: "left" });
    doc.setFont(undefined, "bold");
    doc.text(formatEuro(totals.imponibile), xRight, y, { align: "right" });
    y += 16;

    doc.setFont(undefined, "normal");
    doc.text(`IVA (${aliquotaIva}%)`, xRight - 120, y, { align: "left" });
    doc.setFont(undefined, "bold");
    doc.text(formatEuro(totals.iva), xRight, y, { align: "right" });
    y += 16;

    doc.setDrawColor(200);
    doc.line(W - 260 - MARGIN.right, y, xRight, y);
    y += 14;

    doc.setFontSize(12);
    doc.setTextColor(...COLORS.purple);
    doc.setFont(undefined, "bold");
    doc.text("TOTALE", xRight - 120, y, { align: "left" });
    doc.text(formatEuro(totals.totale), xRight, y, { align: "right" });

    return y + 10;
}

// --- Sezione dati pagamento ---
function drawPayToSection(doc, supplier, invoice, startY) {
    let y = startY;

    // Geometria: due colonne con stessi margini esterni
    const pageWidth = doc.internal.pageSize.getWidth();
    const xLeftEdge = MARGIN.left;
    const xRightEdge = pageWidth - MARGIN.right;
    const totalInner = xRightEdge - xLeftEdge;
    const gutter = 28;                               // spazio centrale tra le colonne
    const colWidth = (totalInner - gutter) / 2;

    const colLeftX = xLeftEdge;                     // Colonna SX = Dati per il pagamento
    const colRightX = xLeftEdge + colWidth + gutter; // Colonna DX = Metodo di pagamento

    // --- Colonna DX: metodo di pagamento selezionato
    let metodoLabel = "";
    switch (invoice?.metodoPagamento) {
        case "contanti": metodoLabel = "Contanti alla consegna"; break;
        case "bonifico_anticipato": metodoLabel = "Bonifico bancario anticipato"; break;
        case "bonifico_30gg": metodoLabel = "Bonifico bancario 30 gg data fattura"; break;
        case "bonifico_60gg": metodoLabel = "Bonifico bancario 60 gg data fattura"; break;
        case "contrassegno": metodoLabel = "Pagamento in contrassegno"; break;
        case "rateale": metodoLabel = "Pagamento rateale"; break;
        case "riba": metodoLabel = "Ricevuta bancaria (Ri.Ba.)"; break;
        default: metodoLabel = invoice?.metodoPagamento || ""; break;
    }

    // --- Colonna SX: righe "Dati per il pagamento"
    const leftLines = [];
    if (supplier?.banca) leftLines.push(`Banca: ${supplier.banca}`);
    if (supplier?.intestatario) leftLines.push(`Intestatario: ${supplier.intestatario}`);
    else if (supplier?.ragioneSociale) leftLines.push(`Intestatario: ${supplier.ragioneSociale}`);
    if (supplier?.iban) leftLines.push(`IBAN: ${String(supplier.iban).toUpperCase()}`);
    else if (invoice?.iban) leftLines.push(`IBAN: ${String(invoice.iban).toUpperCase()}`);

    // Se non c'è nulla da mostrare, esci
    if (leftLines.length === 0 && !metodoLabel) return y;

    // --- Titoli (stile coerente e allineato a sinistra)
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("DATI PER IL PAGAMENTO:", colLeftX, y, { align: "left" });
    doc.text("METODO DI PAGAMENTO:", colRightX, y, { align: "left" });

    // --- Spazio sotto i titoli (leggermente aumentato)
    y += 18;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(0);

    // --- Contenuto colonna SX
    let leftY = y;
    leftLines.forEach((raw) => {
        const wrapped = doc.splitTextToSize(raw, colWidth);
        wrapped.forEach((line) => {
            doc.text(line, colLeftX, leftY, { align: "left" });
            leftY += 13;
        });
    });

    // --- Contenuto colonna DX
    let rightY = y;
    if (metodoLabel) {
        const wrappedRight = doc.splitTextToSize(metodoLabel, colWidth);
        wrappedRight.forEach((line) => {
            doc.text(line, colRightX, rightY, { align: "left" });
            rightY += 13;
        });
    }

    // --- Allinea la prossima sezione alla colonna più lunga
    const nextY = Math.max(leftY, rightY) + 4;
    return nextY;
}




// --- Footer ---
function drawFooter(doc, supplier) {
    const pageCount = doc.getNumberOfPages();
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    const footerLines = [
        supplier?.ragioneSociale || "",
        supplier?.indirizzo || "",
        supplier?.piva ? `P.IVA: ${supplier.piva}` : "",
        supplier?.cf ? `CF: ${supplier.cf}` : "",
        supplier?.email || supplier?.pec || "",
    ].filter(Boolean);

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        const footerY = H - 60;
        doc.setDrawColor(200);
        doc.line(MARGIN.left, footerY - 28, W - MARGIN.right, footerY - 28);

        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.setFont(undefined, "normal");

        const totalWidth = W - MARGIN.left - MARGIN.right;
        const spacing = totalWidth / (footerLines.length + 1);

        footerLines.forEach((line, index) => {
            const x = MARGIN.left + spacing * (index + 1);
            doc.text(line, x, footerY - 12, { align: "center" });
        });

        const pageLabel = `Pagina ${i} di ${pageCount}`;
        doc.text(pageLabel, W - MARGIN.right, H - 10, { align: "right" });
    }
}
