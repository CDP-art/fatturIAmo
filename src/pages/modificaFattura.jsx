import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ModificaFattura() {
    const navigate = useNavigate();
    const location = useLocation();
    const invoiceData = location.state?.invoice;

    if (!invoiceData) {
        navigate("/genera");
        return null;
    }

    function handleExportFattura() {

        if (!numeroFattura || !data || prodotti.length === 0) {
            alert("Compila tutti i campi prima di proseguire");
            return;
        }

        navigate("/esporta", {
            state: {
                invoice: {
                    numeroFattura,
                    data,
                    cliente: {
                        nome: clienteNome,
                        piva: clientePiva,
                        indirizzo: clienteIndirizzo,
                    },
                    prodotti,
                    imponibile: Number(imponibile.toFixed(2)),
                    iva: Number(iva.toFixed(2)),
                    totale: Number(totale),
                },
            },
            replace: true,
        })
    }

    const [numeroFattura, setNumeroFattura] = useState(invoiceData.numeroFattura);
    const [data, setData] = useState(invoiceData.data);
    const [clienteNome, setClienteNome] = useState(invoiceData.cliente.nome);
    const [clientePiva, setClientePiva] = useState(invoiceData.cliente.piva);
    const [clienteIndirizzo, setClienteIndirizzo] = useState(invoiceData.cliente.indirizzo || "");
    const [prodotti, setProdotti] = useState(invoiceData.prodotti || []);
    const [aliquotaIva, setAliquotaIva] = useState(22);

    function updateProdotto(i, campo, valore) {
        const newProdotti = [...prodotti];
        if (campo === "ore" || campo === "prezzo" || campo === "quantita") {
            newProdotti[i][campo] = Number(valore);
        } else {
            newProdotti[i][campo] = valore;
        }
        setProdotti(newProdotti);
    }

    const imponibile = prodotti.reduce((acc, item) => {
        const subtot = Number(item.quantita) * Number(item.prezzo);
        return acc + (isNaN(subtot) ? 0 : subtot);
    }, 0);

    const iva = (imponibile * aliquotaIva) / 100;
    const totale = (imponibile + iva).toFixed(2);

    function aggiungiProdotto() {
        setProdotti([
            ...prodotti,
            {
                descrizione: "",
                quantita: 1,
                prezzo: 0,
            },
        ]);
    }

    function eliminaProdotto(prodottoDaEliminare) {
        const nuoviProdotti = prodotti.filter((_, i) => i !== prodottoDaEliminare);
        setProdotti(nuoviProdotti);
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
                                value={numeroFattura}
                                onChange={(e) => setNumeroFattura(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Data (DD-MM-YYYY)</label>
                            <input
                                type="text"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
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
                                value={clienteNome}
                                onChange={(e) => setClienteNome(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">P.IVA</label>
                            <input
                                type="text"
                                value={clientePiva}
                                onChange={(e) => setClientePiva(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">Indirizzo</label>
                            <input
                                type="text"
                                value={clienteIndirizzo}
                                onChange={(e) => setClienteIndirizzo(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Prodotti / Servizi</h3>
                    <div className="space-y-4 mb-8">
                        {prodotti.map((item, i) => (
                            <div key={i} className="flex gap-2 items-center justify-center">
                                <div className="p-3 border border-gray-200 rounded-lg bg-white w-full">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <label className="block text-sm mb-1">Descrizione</label>
                                            <textarea
                                                rows={2}
                                                value={item.descrizione}
                                                onChange={(e) => updateProdotto(i, "descrizione", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm mb-1">Quantità</label>
                                                <input
                                                    type="number"
                                                    value={item.quantita}
                                                    onChange={(e) => updateProdotto(i, "quantita", e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm mb-1">Prezzo (€)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.prezzo}
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
                    </div>

                    <div className="mb-6 flex flex-col items-end">
                        <label className="block text-sm font-bold mb-1">Aliquota IVA</label>
                        <select
                            value={aliquotaIva}
                            onChange={(e) => setAliquotaIva(Number(e.target.value))}
                            className="w-32 px-4 py-1 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                            <option value={0}>0%</option>
                            <option value={4}>4%</option>
                            <option value={10}>10%</option>
                            <option value={22}>22%</option>
                        </select>
                    </div>

                    <div className="text-right text-xl font-semibold text-purple-600">
                        Totale: € {totale}
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
