
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

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

// Colori applicazione (approx)
const COLORS = {
    purple: [124, 58, 237], // text-purple-600
    blue: [37, 99, 235],    // bg-blue-600
    gray: [80, 80, 80],
};

// Margini base PDF
const MARGIN = { left: 18, top: 16, right: 18, bottom: 16 };

export default function EsportaFatturaPDF() {
    const navigate = useNavigate();
    const location = useLocation();

    // Recupero bozza fattura: dallo state o da localStorage
    const invoiceFromState = location.state?.invoice || null;
    const invoiceFromLS = useMemo(() => safeGetLS("fatturiamo.draft", null), []);
    const invoice = invoiceFromState || invoiceFromLS;

    // Se non ho i dati, torno alla home
    useEffect(() => {
        if (!invoice) navigate("/");
    }, [invoice, navigate]);

    if (!invoice) return null;

    // Handler: genera il PDF e lo salva
    const handleGeneratePDF = () => {
        try {
            generateInvoicePDF(invoice);
        } catch (e) {
            console.error(e);
            alert("Errore durante la generazione del PDF.");
        }
    };

    function handleGenerateXML(invoice) {
        const cliente = invoice?.cliente || {};
        const prodotti = invoice?.prodotti || [];

        const xml = `
<?xml version="1.0" encoding="UTF-8"?>
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
      </Riga>
    `).join("\n")}
  </DettaglioLinee>
  <Totali>
    <Imponibile>${invoice?.imponibile || 0}</Imponibile>
    <IVA>${invoice?.iva || 0}</IVA>
    <Totale>${invoice?.totale || 0}</Totale>
  </Totali>
</Fattura>
`.trim();

        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const filename = `Fattura_${invoice?.numero || "senza-numero"}.xml`;
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <React.Fragment>
            <div className="h-screen bg-gradient-to-br from-blue-300 via-white to-purple-300 py-10 px-10 flex flex-col items-center justify-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10">Esporta la fattura</h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    {/* PDF */}
                    <div className="w-full sm:w-[420px] min-h-[360px] bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-gray-800 flex flex-col justify-between">
                        <p className="text-center text-gray-600 mb-8">Crea un PDF formale con tutti i dati obbligatori di fornitore e cliente.</p>

                        <button
                            onClick={handleGeneratePDF}
                            className="w-full flex items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 p-4 rounded-xl transition shadow-md"
                        >
                            <FaFilePdf className="text-2xl text-purple-600" />
                            <span className="text-lg font-medium">Esporta in PDF</span>
                        </button>

                        <div className="mt-8 text-center">
                            <button onClick={() => navigate("/")} className="text-sm text-blue-600 hover:underline">Torna alla Home</button>
                        </div>
                    </div>

                    {/* XML */}
                    <div className="w-full sm:w-[420px] min-h-[360px] bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-gray-800 flex flex-col justify-between">
                        <p className="text-center text-gray-600 mb-8">Esporta la fattura in un file XML compatibile con software gestionali.</p>

                        <button
                            onClick={() => handleGenerateXML(invoice)}
                            className="w-full flex items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 p-4 rounded-xl transition shadow-md"
                        >
                            <FaFilePdf className="text-2xl text-purple-600" />
                            <span className="text-lg font-medium">Esporta in XML</span>
                        </button>

                        <div className="mt-8 text-center">
                            <button onClick={() => navigate("/")} className="text-sm text-blue-600 hover:underline">Torna alla Home</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

// --- Funzione principale che disegna il PDF ---
function generateInvoicePDF(invoice) {
    // Dati fornitore messi dall’utente in pagina Fornitore
    const supplier = safeGetLS("fatturiamo.supplier", null);

    // Estraggo con fallback per evitare crash
    const numero = invoice?.numeroFattura || invoice?.numero || "N/D";
    const dataFattura = invoice?.data || invoice?.dataFattura || new Date().toLocaleDateString("it-IT");

    // Cliente (atteso dentro la bozza)
    const cliente = invoice?.cliente || {};

    // Righe (supporta sia quantita/prezzo che ore/tariffa)
    const righe = Array.isArray(invoice?.prodotti) ? invoice.prodotti : [];

    // Valori economici
    const imponibile = Number(invoice?.imponibile || 0);
    const iva = Number(invoice?.iva || 0);
    const totale = Number(invoice?.totale || imponibile + iva);

    // Campi fiscali opzionali
    const terminiPagamento = invoice?.terminiPagamento || "Pagamento a 30 giorni data fattura";
    const metodoPagamento = invoice?.metodoPagamento || "Bonifico bancario";
    const iban = (supplier && supplier.iban) || invoice?.iban || "";
    const sdi = (supplier && supplier.sdi) || invoice?.sdi || ""; // Codice Destinatario (per e-fattura)
    const pec = (supplier && (supplier.pec || supplier.email)) || ""; // usa PEC o email
    const cfFornitore = supplier?.cf || "";
    const regimeFiscale = supplier?.regimeFiscale || ""; // es. RF01, Forfettario ecc.

    // Inizializzo PDF (A4 verticale)
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Disegno header con banda colore e logo
    drawHeader(doc, { numero, dataFattura }, supplier);

    // Box Fornitore e Cliente
    let cursorY = 140; // posizione di partenza dopo header
    cursorY = drawSupplierBox(doc, supplier, cursorY);
    cursorY = drawClientBox(doc, cliente, cursorY);

    // Box dati fattura (numero, data, pagamento)
    cursorY = drawInvoiceInfoBox(doc, { numero, dataFattura, terminiPagamento, metodoPagamento, iban, sdi, pec, cfFornitore, regimeFiscale }, cursorY);

    // Tabella righe
    cursorY = drawItemsTable(doc, righe, cursorY);

    // Riepilogo economico
    cursorY = drawTotals(doc, { imponibile, iva, totale }, cursorY);

    // Footer (pagina, nota)
    drawFooter(doc);

    // Nome file professionale
    const clienteNome = (cliente?.nome || cliente?.denominazione || "cliente").toString().replace(/[/\\<>:"|?*]+/g, "_");
    const filename = `Fattura_${numero}_${clienteNome}.pdf`;
    doc.save(filename);
}

// --- Header ---
function drawHeader(doc, testata, supplier) {
    const W = doc.internal.pageSize.getWidth();
    const cx = W / 2;

    doc.setTextColor(...COLORS.gray);

    // Logo a sinistra
    if (supplier?.logoDataUrl) {
        try {
            doc.addImage(supplier.logoDataUrl, "PNG", MARGIN.left, 24, 64, 64);
        } catch { }
    }

    // Dati azienda a destra
    const rightX = W - MARGIN.right;
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(String(supplier?.ragioneSociale || "La tua azienda"), rightX, 38, { align: "right" });

    if (supplier?.settore || supplier?.ruolo) {
        doc.setFontSize(9);
        doc.setFont(undefined, "normal");
        doc.text(String(supplier.settore || supplier.ruolo), rightX, 54, { align: "right" });
    }

    // Titolo + numero centrati
    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("FATTURA", cx, 110, { align: "center" });

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(`#${String(testata.numero)}`, cx, 126, { align: "center" });
}

// --- Box Fornitore ---
function drawSupplierBox(doc, supplier, startY) {
    return startY;
}

// --- Box Cliente ---
function drawClientBox(doc, cliente, startY) {
    let y = Math.max(startY, 150);

    // Etichette
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLORS.gray);
    doc.text("FATTURATO A:", MARGIN.left, y);

    doc.text("DATA:", doc.internal.pageSize.getWidth() - MARGIN.right - 120, y, { align: "left" });

    // Valori
    y += 14;
    doc.setFont(undefined, "normal");
    const billedLines = [
        cliente?.nome || cliente?.denominazione || "",
        cliente?.indirizzo || "",
        cliente?.piva ? `P.IVA: ${cliente.piva}` : "",
        cliente?.cf ? `CF: ${cliente.cf}` : "",
        cliente?.email ? `Email: ${cliente.email}` : "",
        cliente?.pec ? `PEC: ${cliente.pec}` : "",
    ].filter(Boolean);

    billedLines.forEach((line, i) => {
        doc.text(line, MARGIN.left, y + i * 12);
    });

    // Data a destra
    doc.text(
        String(new Date().toLocaleDateString("it-IT")),
        doc.internal.pageSize.getWidth() - MARGIN.right,
        y,
        { align: "right" }
    );

    // Sposto y alla fine dei dati cliente
    y += billedLines.length * 12 + 10;

    // Linea divisoria sottile
    doc.setDrawColor(220);
    doc.line(MARGIN.left, y, doc.internal.pageSize.getWidth() - MARGIN.right, y);

    return y + 8;
}

// --- Box Info Fattura / Pagamenti ---
function drawInvoiceInfoBox(doc, info, startY) {
    return startY + 4; // no-op (spaziatura minima)
}

// --- Tabella righe ---
function drawItemsTable(doc, righe, startY) {
    const head = [["Descrizione", "Tariffa", "Ore", "Importo"]];

    const body = (righe || []).map((r) => {
        const hours = r.ore ?? r.quantita ?? 0;
        const rate = r.tariffa ?? r.prezzo ?? 0;
        const amount = Number(hours) * Number(rate);
        return [
            r.descrizione || "",
            `${formatEuro(rate)}/h`,
            String(hours),
            formatEuro(amount),
        ];
    });

    autoTable(doc, {
        startY: startY + 6,
        head,
        body,
        styles: { fontSize: 10, lineColor: [235, 235, 235], lineWidth: 0.8 },
        headStyles: { fillColor: [255, 255, 255], textColor: [60, 60, 60], fontStyle: "bold" },
        theme: "grid",
        margin: { left: MARGIN.left, right: MARGIN.right },
        columnStyles: {
            0: { cellWidth: 260 },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
        },
    });

    return (doc.lastAutoTable?.finalY || startY + 40) + 10;
}

// Semplice euristica se manca aliquota su riga
function invoiceGuessAliquota(riga) {
    if (!riga) return 22;
    if (riga.esente === true || riga.naturaIva) return 0; // Natura IVA indicata → esente/non imponibile
    return 22;
}

// --- Totali ---
function drawTotals(doc, totals, startY) {
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
    if (Number(totals.iva) > 0) {
        doc.setFont(undefined, "normal");
        doc.text("IVA", xRight - 120, y, { align: "left" });
        doc.setFont(undefined, "bold");
        doc.text(formatEuro(totals.iva), xRight, y, { align: "right" });
        y += 16;
    }

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

// --- Footer con pagina e nota ---
function drawFooter(doc) {

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(120);
        const pageLabel = `Pagina ${i} di ${pageCount}`;
        doc.text(
            pageLabel,
            doc.internal.pageSize.getWidth() - MARGIN.right,
            doc.internal.pageSize.getHeight() - 10,
            { align: "right" }
        );
        doc.text(
            "Generato automaticamente da FatturIAmo",
            MARGIN.left,
            doc.internal.pageSize.getHeight() - 10
        );
    }
}
