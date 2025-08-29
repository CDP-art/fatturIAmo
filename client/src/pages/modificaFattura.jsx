import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
        if (!form.numeroFattura || !form.data || form.prodotti.length === 0) {
            alert("Compila tutti i campi obbligatori prima di proseguire");
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

    return (
        <React.Fragment>
            <div className="relative min-h-screen bg-gradient-to-br from-blue-300 via-white to-purple-400 px-4 py-10 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-black/30 z-0" />

                <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 p-4 sm:p-8 text-gray-800">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Modifica la tua fattura</h2>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Numero Fattura</label>
                            <input
                                type="text"
                                value={form.numeroFattura || ""}
                                onChange={setField("numeroFattura")}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Data (DD/MM/YYYY)</label>
                            <input
                                type="text"
                                value={form.data || ""}
                                onChange={setField("data")}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Cliente</h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome e Cognome</label>
                            <input
                                type="text"
                                value={form.clienteNome || ""}
                                onChange={setField("clienteNome")}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">P.IVA</label>
                            <input
                                type="text"
                                value={form.clientePiva || ""}
                                onChange={setField("clientePiva")}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">Indirizzo</label>
                            <input
                                type="text"
                                value={form.clienteIndirizzo || ""}
                                onChange={setField("clienteIndirizzo")}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Prodotti / Servizi</h3>
                    <div className="space-y-4 mb-8">
                        {form.prodotti.map((item, i) => (
                            <div key={i} className="flex gap-2 items-center justify-center">
                                <div className="p-3 border border-gray-200 rounded-lg bg-white w-full">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label className="block text-sm mb-1">Descrizione</label>
                                            <textarea
                                                rows={2}
                                                value={item.descrizione || ""}
                                                onChange={(e) => updateProdotto(i, "descrizione", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm mb-1">Quantità</label>
                                                <input
                                                    type="number"
                                                    value={Number.isFinite(item.quantita) ? item.quantita : 0}
                                                    onChange={(e) => updateProdotto(i, "quantita", e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm mb-1">Prezzo (€)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={Number.isFinite(item.prezzo) ? item.prezzo : 0}
                                                    onChange={(e) => updateProdotto(i, "prezzo", e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 pt-1">
                                    <button
                                        onClick={() => eliminaProdotto(i)}
                                        className="h-8 w-8 text-red-500 border border-red-300 rounded-full hover:bg-red-100 transition"
                                        aria-label="Rimuovi riga"
                                    >
                                        &minus;
                                    </button>
                                    <button
                                        onClick={aggiungiProdotto}
                                        className="h-8 w-8 text-purple-600 border border-purple-300 rounded-full hover:bg-purple-100 transition"
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

                    <div className="mb-6 flex flex-col items-end">
                        <label className="block text-sm font-bold mb-1">Aliquota IVA</label>
                        <select
                            value={Number(form.aliquotaIva)}
                            onChange={(e) => setForm((prev) => ({ ...prev, aliquotaIva: Number(e.target.value) }))}
                            className="w-32 px-4 py-1 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                            <option value={0}>0%</option>
                            <option value={4}>4%</option>
                            <option value={10}>10%</option>
                            <option value={22}>22%</option>
                        </select>
                    </div>

                    <div className="text-right text-xl font-semibold text-purple-600">
                        Totale: € {totale.toFixed(2)}
                    </div>
                </div>

                <footer className="relative z-10 w-full max-w-2xl mt-10 px-4 text-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
                        onClick={handleExportFattura}
                    >
                        Salva e Prosegui
                    </button>
                </footer>
            </div>
        </React.Fragment>
    );
}
