import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EsportazioneCard from "../components/EsportazioneCard";
import EsportazioneButtons from "../components/EsportazioneButtons";

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
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
}

const COLORS = {
    purple: [124, 58, 237],
    blue: [37, 99, 235],
    gray: [80, 80, 80],
};

const MARGIN = { left: 18, top: 16, right: 18, bottom: 16 };

export default function EsportaFatturaPDF() {
    const navigate = useNavigate();
    const location = useLocation();
    // Provo a caricare la fattura dallo stato (es. da una pagina precedente)
    const invoiceFromState = location.state?.invoice || null;

    // Se non esiste, provo a caricarla dal localStorage (es. salvataggio automatico)
    const invoiceFromLS = useMemo(() => safeGetLS("fatturiamo.draft", null), []);

    // Uso quella che trovo per prima
    const invoice = invoiceFromState || invoiceFromLS;


    useEffect(() => {
        if (!invoice) navigate("/");
    }, [invoice, navigate]);

    if (!invoice) return null;

    const handleGeneratePDF = () => {
        try {
            generateInvoicePDF(invoice);
        } catch (e) {
            console.error(e);
            alert("Errore durante la generazione del PDF.");
        }
    };

    const handleGenerateXML = (invoice) => {
        const cliente = invoice?.cliente || {};
        const prodotti = invoice?.prodotti || [];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Fattura>
  <Intestazione>
    <Numero>${invoice?.numeroFattura || invoice?.numero || "N/D"}</Numero>
    <Data>${invoice?.data || invoice?.dataFattura || new Date().toISOString().split("T")[0]}</Data>
  </Intestazione>
  <Cliente>
    <Nome>${cliente?.nome || cliente?.denominazione || ""}</Nome>
    <Indirizzo>${cliente?.indirizzo || ""}</Indirizzo>
    <PIVA>${cliente?.piva || ""}</PIVA>
    <CF>${cliente?.cf || ""}</CF>
    <Email>${cliente?.email || cliente?.pec || ""}</Email>
  </Cliente>
  <DettaglioLinee>
    ${prodotti.map(p => `
      <Riga>
        <Descrizione>${p.descrizione || ""}</Descrizione>
        <Ore>${p.ore || p.quantita || 0}</Ore>
        <Tariffa>${p.tariffa || p.prezzo || 0}</Tariffa>
      </Riga>`).join("\n")}
  </DettaglioLinee>
  <Totali>
    <Imponibile>${invoice?.imponibile || 0}</Imponibile>
    <IVA>${invoice?.iva || 0}</IVA>
    <Totale>${invoice?.totale || 0}</Totale>
  </Totali>
</Fattura>`.trim();

        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Fattura_${invoice?.numero || "senza-numero"}.xml`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="relative h-screen w-full bg-gradient-to-br from-blue-300 via-white to-purple-300">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">Esporta la fattura</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start fade-in">
                        <EsportazioneCard descrizioneCard="Crea un PDF formale con tutti i dati obbligatori di fornitore e cliente.">
                            <EsportazioneButtons action={handleGeneratePDF} testoBottone="Esporta in PDF" />
                        </EsportazioneCard>
                        <EsportazioneCard descrizioneCard="Esporta un file XML compatibile con i requisiti della fatturazione elettronica.">
                            <EsportazioneButtons action={() => handleGenerateXML(invoice)} testoBottone="Esporta in XML" />
                        </EsportazioneCard>
                    </div>
                </div>
            </div>
        </>
    );
}


// --- Funzione principale che disegna il PDF ---
function generateInvoicePDF(invoice) {
    const supplier = safeGetLS("fatturiamo.supplier", null);

    const numero = invoice?.numeroFattura || invoice?.numero || "N/D";
    const dataFattura = invoice?.data || invoice?.dataFattura || new Date().toLocaleDateString("it-IT");
    const cliente = invoice?.cliente || {};
    const righe = Array.isArray(invoice?.prodotti) ? invoice.prodotti : [];

    // Totali
    const imponibile = Number(invoice?.imponibile || 0);
    const iva = Number(invoice?.iva || 0);
    const totale = invoice?.totale != null ? Number(invoice.totale) : imponibile + iva;

    // Altri dati
    const terminiPagamento = invoice?.terminiPagamento || "Pagamento a 30 giorni data fattura";
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
    cursorY = drawInvoiceInfoBox(doc, {
        numero,
        dataFattura,
        terminiPagamento,
        metodoPagamento,
        iban,
        sdi,
        pec,
        cfFornitore,
        regimeFiscale,
    }, cursorY);
    cursorY = drawItemsTable(doc, righe, cursorY);
    cursorY = drawTotals(doc, {
        imponibile,
        iva,
        totale,
        aliquotaIva: invoice?.aliquotaIva || 0
    }, cursorY);

    // Calcolo posizionamento basso per la sezione "dati pagamento"
    const tableEndY = cursorY;
    const paySectionHeight = 60;
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginAboveFooter = 100;
    const paySectionY = Math.max(tableEndY + 20, pageHeight - marginAboveFooter - paySectionHeight);

    drawPayToSection(doc, supplier, paySectionY);
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
            doc.addImage(supplier.logoDataUrl, "PNG", MARGIN.left, MARGIN.top, logoSize, logoSize);
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
    doc.text(supplier?.ragioneSociale || "Nome Azienda", rightX, topY + 4, { align: "right" });

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
    return startY;
}

// --- Box Cliente ---
function drawClientBox(doc, cliente, startY, dataFattura) {
    let y = Math.max(startY + 20, 120); // aggiungo un po’ di margine sopra

    // Data della fattura (sotto i dati cliente)
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("DATA:", MARGIN.left, y);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.setTextColor(20);
    doc.text(String(dataFattura), MARGIN.left + 70, y); // leggermente spostata a destra

    y += 40;


    // Etichetta
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("FATTURATO A:", MARGIN.left, y);

    // Dati cliente
    y += 18; // un po’ più spazio se il titolo è grande
    doc.setFontSize(12); // ← ripristina dimensione
    doc.setFont(undefined, "normal");
    doc.setTextColor(20);

    // Dati cliente
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

    return y + 20; // restituisco la nuova Y per continuare il flusso

}



// --- Box Info Fattura / Pagamenti ---
function drawInvoiceInfoBox(doc, info, startY) {
    return startY + 4; // no-op (spaziatura minima)
}

// --- Tabella righe ---
function drawItemsTable(doc, righe, startY) {
    const head = [["Descrizione", "Tariffa", "Ore", "Importo"]];

    const body = (righe || []).map((r) => {
        const ore = Number(r.ore ?? r.quantita ?? 0);
        const tariffa = Number(r.tariffa ?? r.tariffaOraria ?? r.prezzo ?? 0);
        const importo = ore * tariffa;

        const labelTariffa = (ore && r.ore !== undefined)
            ? `${formatEuro(tariffa)}/h`
            : formatEuro(tariffa);

        return [
            r.descrizione || "",
            labelTariffa,
            String(ore),
            formatEuro(importo),
        ];
    });

    const table = autoTable(doc, {
        startY: startY + 10,
        head,
        body,
        theme: "grid",
        margin: "auto", // centra la tabella
        tableWidth: "auto", // larghezza automatica in base al contenuto
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


// Semplice euristica se manca aliquota su riga
function invoiceGuessAliquota(riga) {
    if (!riga) return 22;
    if (riga.esente === true || riga.naturaIva) return 0; // Natura IVA indicata → esente/non imponibile
    return 22;
}

// --- Totali ---
function drawTotals(doc, totals, startY) {
    const { imponibile, iva, totale, aliquotaIva } = totals;
    const W = doc.internal.pageSize.getWidth();
    const xRight = W - MARGIN.right;
    let y = startY + 8;

    // Linea superiore sottile
    doc.setDrawColor(200);
    doc.line(W - 260 - MARGIN.right, y, xRight, y);
    y += 12;

    // Sub-totale
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.setFont(undefined, "normal");
    doc.text("Sub-Totale", xRight - 120, y, { align: "left" });
    doc.setFont(undefined, "bold");
    doc.text(formatEuro(totals.imponibile), xRight, y, { align: "right" });
    y += 16;

    // IVA (se presente)
    doc.setFont(undefined, "normal");
    doc.text(`IVA (${aliquotaIva}%)`, xRight - 120, y, { align: "left" });
    doc.setFont(undefined, "bold");
    doc.text(formatEuro(totals.iva), xRight, y, { align: "right" });
    y += 16;

    // Linea separatrice
    doc.setDrawColor(200);
    doc.line(W - 260 - MARGIN.right, y, xRight, y);
    y += 14;

    // TOTALE evidenziato (colore brand)
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.purple);
    doc.setFont(undefined, "bold");
    doc.text("TOTALE", xRight - 120, y, { align: "left" });
    doc.text(formatEuro(totals.totale), xRight, y, { align: "right" });

    return y + 10;
}

// --- Sezione dati pagamento ---
function drawPayToSection(doc, supplier, startY) {
    let y = startY;

    const lines = [];

    if (supplier?.banca) {
        lines.push(`Banca: ${supplier.banca}`);
    }

    if (supplier?.intestatario) {
        lines.push(`Intestatario: ${supplier.intestatario}`);
    } else if (supplier?.ragioneSociale) {
        lines.push(`Intestatario: ${supplier.ragioneSociale}`);
    }

    if (supplier?.iban) {
        lines.push(`IBAN: ${supplier.iban}`);
    }

    if (lines.length === 0) {
        return y; // Se non ci sono dati da mostrare, esco senza disegnare nulla
    }

    // Titolo sezione
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("DATI PER IL PAGAMENTO", MARGIN.left, y);

    y += 16; // margine dopo il titolo
    doc.setFontSize(10); // torna a 10 o la dimensione passata prima
    doc.setFont(undefined, "normal");
    doc.setTextColor(0);

    // Linee successive
    lines.forEach((line, i) => {
        doc.text(line, MARGIN.left, y + i * 14);
    });

}

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
        // Linea divisoria sopra il footer
        doc.setDrawColor(200);
        doc.line(MARGIN.left, footerY - 28, W - MARGIN.right, footerY - 28);

        // Footer in una riga con spazi orizzontali
        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.setFont(undefined, "normal");

        const totalWidth = W - MARGIN.left - MARGIN.right;
        const spacing = totalWidth / (footerLines.length + 1); // +1 per spazio iniziale

        footerLines.forEach((line, index) => {
            const x = MARGIN.left + spacing * (index + 1);
            doc.text(line, x, footerY - 12, { align: "center" });
        });

        // Numero pagina in basso a destra
        const pageLabel = `Pagina ${i} di ${pageCount}`;
        doc.text(pageLabel, W - MARGIN.right, H - 10, { align: "right" });
    }
}


