import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Lettura sicura da LocalStorage
function safeGetLS(key, def = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : def;
    } catch {
        return def;
    }
}

// Mapping iniziale “sicuro” per evitare null negli input
// Inizializzare i valori di default a stringa
function buildInitialForm(invoice) {
    const inv = invoice || {};

    const cliente = inv.cliente || {};
    const prodotti = Array.isArray(inv.prodotti) ? inv.prodotti : [];

    return {
        numeroFattura: inv.numeroFattura || inv.numero || "",
        data: inv.data || inv.dataFattura || "",
        clienteNome: cliente.nome || cliente.denominazione || "",
        clientePiva: cliente.piva || "",
        clienteIndirizzo: cliente.indirizzo || "",
        prodotti: prodotti.map((p) => ({
            descrizione: p?.descrizione || "",
            quantita: Number(p?.quantita ?? p?.ore ?? 1),
            prezzo: Number(p?.prezzo ?? p?.tariffa ?? 0),
        })),
        aliquotaIva: Number(inv.aliquotaIva ?? 22),
    };
}

export default function ModificaFattura() {
    const navigate = useNavigate();
    const location = useLocation();

    // Leggo invoice da state o da Local Storage (fallback)
    const invoiceFromState = location.state?.invoice || null;
    const draftFromLS = useMemo(() => safeGetLS("fatturiamo.draft", null), []);
    const invoiceData = invoiceFromState || draftFromLS;

    // Se non ho nulla, reindirizzo
    useEffect(() => {
        if (!invoiceData) {
            navigate("/genera", { replace: true });
        }
    }, [invoiceData, navigate]);

    if (!invoiceData) return null;

    // Stato form (tutti stringhe o numeri “safe”)
    const [form, setForm] = useState(() => buildInitialForm(invoiceData));

    // Handlers semplici
    const setField = (key) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Prodotti
    function updateProdotto(index, campo, valore) {
        setForm((prev) => {
            const next = { ...prev, prodotti: [...prev.prodotti] };
            const row = { ...next.prodotti[index] };

            if (campo === "quantita" || campo === "prezzo") {
                row[campo] = Number(valore);
            } else {
                row[campo] = valore;
            }

            next.prodotti[index] = row;
            return next;
        });
    }

    function aggiungiProdotto() {
        setForm((prev) => ({
            ...prev,
            prodotti: [...prev.prodotti, { descrizione: "", quantita: 1, prezzo: 0 }],
        }));
    }

    function eliminaProdotto(indiceDaEliminare) {
        const conferma = window.confirm("Vuoi davvero eliminare questa riga?");
        if (!conferma) return;
        setForm((prev) => {
            const idx = Number(indiceDaEliminare);
            if (Number.isNaN(idx) || idx < 0 || idx >= prev.prodotti.length) return prev;
            const next = { ...prev, prodotti: [...prev.prodotti] };
            next.prodotti.splice(idx, 1);
            return next;
        });
    }

    // Derivate
    const imponibile = form.prodotti.reduce((acc, item) => {
        const q = Number(item.quantita) || 0;
        const p = Number(item.prezzo) || 0;
        return acc + q * p;
    }, 0);

    const iva = (imponibile * Number(form.aliquotaIva || 0)) / 100;
    const totale = imponibile + iva;

    // Export
    function handleExportFattura() {
        if (!form.numeroFattura ||
            !form.data ||
            !form.clienteNome ||
            !form.clientePiva ||
            !form.clienteIndirizzo ||
            form.prodotti.length === 0 ||
            form.prodotti.some(p => !p.descrizione || p.prezzo <= 0 || p.quantita <= 0)
        ) {
            Swal.fire({
                icon: "warning",
                title: "Tutti i campi sono obbligatori",
                text: "Compila tutti i campi prima di proseguire.",
                customClass: {
                    popup: "rounded-2xl shadow-xl bg-white",
                    confirmButton:
                        "bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95",
                },
                buttonsStyling: false,
                confirmButtonText: "Ok, capito",
            });
            return;
        }

        // Costruisco l'oggetto invoice pulito
        const invoice = {
            numeroFattura: form.numeroFattura,
            data: form.data,
            cliente: {
                nome: form.clienteNome,
                piva: form.clientePiva,
                indirizzo: form.clienteIndirizzo,
            },
            prodotti: form.prodotti,
            imponibile: Number(imponibile.toFixed(2)),
            iva: Number(iva.toFixed(2)),
            totale: Number(totale.toFixed(2)),
            aliquotaIva: Number(form.aliquotaIva),
        };

        // Salvo anche come draft aggiornato (così /esporta o refresh non perdono i dati)
        try {
            localStorage.setItem("fatturiamo.draft", JSON.stringify(invoice));
        } catch { }

        navigate("/esporta", { state: { invoice }, replace: true });
    }

    function formatoEuro(numero) {
        return Number(numero || 0).toLocaleString("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Modifica Fattura - FatturIAmo</title>
                <meta
                    name="description"
                    content="Modifica la fattura generata: correggi descrizioni, quantità, prezzi e dati cliente per esportarla in PDF o XML."
                />
                <meta
                    name="keywords"
                    content="modifica fattura, editor fattura, fattura personalizzata, aggiorna fattura, FatturIAmo"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Claudio De Paolis" />

                {/* Open Graph */}
                <meta property="og:title" content="Modifica Fattura - FatturIAmo" />
                <meta
                    property="og:description"
                    content="Correggi, personalizza o completa la fattura generata automaticamente con l’IA."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://fatturiamo.ai/modifica" />
                <meta property="og:image" content="https://fatturiamo.ai/og-modifica.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Modifica Fattura - FatturIAmo" />
                <meta
                    name="twitter:description"
                    content="Modifica la tua fattura: aggiungi righe, cambia IVA, aggiorna il cliente e scarica il PDF aggiornato."
                />
                <meta name="twitter:image" content="https://fatturiamo.ai/og-modifica.png" />
            </Helmet>

            {/* Contenitore principale */}
            <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-purple-400 animate-gradient">
                {/* Overlay che copre tutta la viewport */}
                <div className="absolute inset-0 bg-black/20 z-0" />

                {/* Card */}
                <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-xl ring-1 ring-gray-200 p-6 sm:p-10 text-gray-800 m-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
                        ✏️ Modifica la tua fattura
                    </h2>

                    {/* Campi intestazione */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Numero Fattura</label>
                            <input
                                type="text"
                                value={form.numeroFattura || ""}
                                onChange={setField("numeroFattura")}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
                            <input
                                type="text"
                                value={form.data || ""}
                                onChange={setField("data")}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Cliente */}
                    <h3 className="text-lg font-semibold mb-4">👤 Cliente</h3>
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nome e Cognome</label>
                            <input
                                type="text"
                                value={form.clienteNome || ""}
                                onChange={setField("clienteNome")}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">P.IVA</label>
                            <input
                                type="text"
                                value={form.clientePiva || ""}
                                onChange={setField("clientePiva")}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Indirizzo</label>
                            <input
                                type="text"
                                value={form.clienteIndirizzo || ""}
                                onChange={setField("clienteIndirizzo")}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Prodotti */}
                    <h3 className="text-lg font-semibold mb-4">🛒 Prodotti / Servizi</h3>
                    <div className="space-y-6 mb-10">
                        {form.prodotti.map((item, i) => (
                            <div key={i} className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 relative">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Descrizione</label>
                                        <textarea
                                            rows={2}
                                            value={item.descrizione || ""}
                                            onChange={(e) => updateProdotto(i, "descrizione", e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Quantità</label>
                                            <input
                                                type="number"
                                                value={item.quantita}
                                                onChange={(e) => updateProdotto(i, "quantita", e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Prezzo (€)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.prezzo}
                                                onChange={(e) => updateProdotto(i, "prezzo", e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottoni add/remove riga */}
                                <div className="absolute top-1 right-0 pr-4 flex gap-2">
                                    <button
                                        onClick={() => eliminaProdotto(i)}
                                        className="h-8 w-8 text-red-500 border border-red-300 rounded-full hover:bg-red-100 flex items-center justify-center transition"
                                        aria-label="Rimuovi riga"
                                    >
                                        &minus;
                                    </button>
                                    <button
                                        onClick={aggiungiProdotto}
                                        className="h-8 w-8 text-purple-600 border border-purple-300 rounded-full hover:bg-purple-100 flex items-center justify-center transition"
                                        aria-label="Aggiungi riga"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                        {form.prodotti.length === 0 && (
                            <div className="text-sm text-gray-600">
                                Nessuna riga presente. Aggiungi un prodotto/servizio con il pulsante “+”.
                            </div>
                        )}
                    </div>

                    {/* Aliquota + Totale */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Aliquota IVA</label>
                            <select
                                value={form.aliquotaIva}
                                onChange={(e) => setForm((prev) => ({ ...prev, aliquotaIva: Number(e.target.value) }))}
                                className="w-40 px-4 py-2 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                            >
                                <option value={0}>0%</option>
                                <option value={4}>4%</option>
                                <option value={10}>10%</option>
                                <option value={22}>22%</option>
                            </select>
                        </div>

                        <div className="text-right text-2xl font-bold text-purple-600">
                            Totale: € {formatoEuro(totale)}
                        </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95"
                        >
                            ↩️ Torna indietro
                        </button>
                        <button
                            onClick={handleExportFattura}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:brightness-110 text-white px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95"
                        >
                            💾 Salva modifiche
                        </button>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}
