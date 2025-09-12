import React, { useState } from "react";
import axios from "axios";

function safeGetLS(key) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
}

// Normalizzatore invariato
function normalizeInvoice(json) {
    const supplier = safeGetLS("fatturiamo.supplier") || {};
    const righe = Array.isArray(json?.righe) ? json.righe
        : Array.isArray(json?.prodotti) ? json.prodotti
            : [];

    const prodotti = righe.map(r => ({
        descrizione: r?.descrizione || "",
        quantita: Number(r?.quantita ?? r?.ore ?? 0),
        prezzo: Number(r?.prezzo ?? r?.tariffa ?? 0),
        aliquotaIva: Number(r?.aliquotaIva ?? r?.aliquotaIvaPct ?? json?.opzioni?.aliquotaIvaPct ?? 22),
    }));

    const imponibile = prodotti.reduce((acc, it) => acc + (it.quantita * it.prezzo), 0);
    const aliquotaDoc = Number(json?.opzioni?.aliquotaIvaPct ?? json?.aliquotaIva ?? 22);
    const iva = json?.iva != null ? Number(json.iva) : (imponibile * aliquotaDoc) / 100;
    const totale = json?.totale != null ? Number(json.totale) : (imponibile + iva);

    return {
        numeroFattura: json?.numeroFattura || json?.numero || "",
        data: json?.data || json?.dataFattura || "",
        cliente: {
            nome: json?.cliente?.nome || json?.cliente?.denominazione || json?.cliente?.ragioneSociale || "",
            piva: json?.cliente?.piva || json?.cliente?.partitaIva || "",
            indirizzo: json?.cliente?.indirizzo || "",
            email: json?.cliente?.email || "",
        },
        fornitore: {
            ragioneSociale: supplier?.ragioneSociale || json?.fornitore?.ragioneSociale || "",
            nome: supplier?.ragioneSociale || json?.fornitore?.nome || "",
            piva: supplier?.piva || json?.fornitore?.piva || "",
            indirizzo: supplier?.indirizzo || json?.fornitore?.indirizzo || "",
            email: supplier?.email || json?.fornitore?.email || "",
            telefono: supplier?.telefono || json?.fornitore?.telefono || "",
        },
        prodotti,
        imponibile: Number(imponibile.toFixed(2)),
        iva: Number(iva.toFixed(2)),
        totale: Number(totale.toFixed(2)),
        aliquotaIva: aliquotaDoc,
        note: json?.note ?? null,
    };
}

export default function PromptInput({ onGenerated }) {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleGenerate = async () => {
        setErr("");
        if (!text.trim()) {
            setErr("Scrivi cosa vuoi fatturare (es. Crea una fattura da 300€ per sopralluogo).");
            return;
        }

        setIsLoading(true);
        try {
            const supplierRaw = safeGetLS("fatturiamo.supplier");
            const supplier = supplierRaw ? {
                ragioneSociale: supplierRaw.ragioneSociale || "",
                piva: supplierRaw.piva || "",
                indirizzo: supplierRaw.indirizzo || "",
                email: supplierRaw.email || "",
                telefono: supplierRaw.telefono || "",
            } : null;

            const baseURL = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8000";
            const { data } = await axios.post(`${baseURL}/genera`, { prompt: text, supplier }, { timeout: 15000 });

            if (!data || data.ok !== true || !data.data) {
                throw new Error(data?.error || "Risposta non valida dal server");
            }

            const normalized = normalizeInvoice(data.data);
            localStorage.setItem("fatturiamo.draft", JSON.stringify(normalized));
            onGenerated && onGenerated(normalized);
        } catch (e) {
            console.error(e);
            setErr(`Qualcosa è andato storto: ${e?.message || "errore sconosciuto"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-6 w-full max-w-2xl mx-auto">
            <textarea
                className="w-full h-40 p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                placeholder="✍️ Es: 'Crea una fattura di 500€ con IVA inclusa per consulenza marketing'."
                aria-label="Inserisci i dettagli della fattura"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {err && <p className="text-red-600 text-sm">{err}</p>}

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:brightness-110 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-2xl shadow-md transition-transform duration-300 active:scale-95 mx-auto w-full sm:w-auto"
            >
                {isLoading ? "⚡ Generazione in corso..." : "🚀 Genera fattura"}
            </button>
        </div>
    );
}
