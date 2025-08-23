import React from "react";
import { FaFilePdf, FaFileCode } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EsportaFattura() {
    const navigate = useNavigate();
    const location = useLocation();
    const invoice = location.state?.invoice;

    if (!invoice) {
        navigate("/");
        return null;
    }

    const handleExport = (formato) => {
        alert(`Esportazione in formato: ${formato}`);
        // Qui potrai generare anche l'XML
    };

    function generatePDF() {
        const { numeroFattura, data, cliente, prodotti, imponibile, iva, totale } = invoice;

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Fattura", 20, 20);

        doc.setFontSize(12);
        doc.text(`Numero: ${numeroFattura}`, 20, 30);
        doc.text(`Data: ${data}`, 20, 38);

        doc.text("Cliente:", 20, 50);
        doc.text(cliente.nome, 30, 58);
        doc.text(cliente.piva, 30, 66);
        doc.text(cliente.indirizzo, 30, 74);

        autoTable(doc, {
            startY: 85,
            head: [['Descrizione', 'Quantità', 'Prezzo', 'Totale']],
            body: prodotti.map(item => [
                item.descrizione,
                item.quantita,
                `€ ${Number(item.prezzo).toFixed(2)}`,
                `€ ${(item.quantita * item.prezzo).toFixed(2)}`
            ]),
        });

        const finaleY = doc.lastAutoTable.finalY + 10;
        doc.text(`Imponibile: € ${imponibile.toFixed(2)}`, 140, finaleY);
        doc.text(`IVA: € ${iva.toFixed(2)}`, 140, finaleY + 8);
        doc.setFontSize(14);
        doc.setTextColor(80, 0, 120);
        doc.text(`Totale: € ${totale.toFixed(2)}`, 140, finaleY + 18);

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Generato automaticamente da FatturIAmo", 20, 285);

        doc.save("fattura.pdf");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-10 px-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-gray-800">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">Esporta la fattura</h1>
                <p className="text-center text-gray-600 mb-8">Scegli il formato in cui salvare la fattura generata.</p>

                <div className="grid sm:grid-cols-2 gap-6">
                    <button
                        onClick={generatePDF}
                        className="flex flex-col items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 p-6 rounded-xl transition shadow-md"
                    >
                        <FaFilePdf className="text-4xl text-purple-600" />
                        <span className="text-lg font-medium">Esporta in PDF</span>
                    </button>

                    <button
                        onClick={() => handleExport("xml")}
                        className="flex flex-col items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 p-6 rounded-xl transition shadow-md"
                    >
                        <FaFileCode className="text-4xl text-purple-600" />
                        <span className="text-lg font-medium">Esporta in XML</span>
                    </button>
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Torna alla Home
                    </button>
                </div>
            </div>
        </div>
    );
}
