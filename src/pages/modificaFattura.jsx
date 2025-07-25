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

    const [numeroFattura, setNumeroFattura] = useState(invoiceData.numeroFattura);
    const [data, setData] = useState(invoiceData.data);
    const [clienteNome, setClienteNome] = useState(invoiceData.cliente.nome);
    const [clientePiva, setClientePiva] = useState(invoiceData.cliente.piva);
    const [clienteIndirizzo, setClienteIndirizzo] = useState(invoiceData.cliente.indirizzo || "");
    const [prodotti, setProdotti] = useState(invoiceData.prodotti || []);


    // creiamo una funzione che prende in entrata
    // i come come indice del prodotto,
    // campo che sta per campo da modificare
    // e valore che è il nuovo valore da impostare
    function updateProdotto(i, campo, valore) {

        // creiamo una copia dell'array dei prodotti
        // e aggiorniamo il campo specificato
        // con il nuovo valore
        const newProdotti = [...prodotti];

        // se il campo è "quantita" o "prezzo", convertiamo il valore in numero
        // altrimenti lo impostiamo direttamente
        if (campo === "quantita" || campo === "prezzo") {
            newProdotti[i][campo] = Number(valore);
        } else {
            newProdotti[i][campo] = valore;
        }
        // aggiorniamo lo stato dei prodotti
        setProdotti(newProdotti);
    }

    //Mostriamo il totale dei prodotti
    const totale = prodotti.reduce((acc, item) => {
        const subTot = Number(item.quantita) * Number(item.prezzo);
        return acc + (isNaN(subTot) ? 0 : subTot);
    }, 0).toFixed(2);

    return (
        <React.Fragment>
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-gray-800">
                <h2 className="text-3xl font-bold text-center mb-8">Modifica Fattura</h2>

                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Numero Fattura</label>
                        <input
                            type="text"
                            value={numeroFattura}
                            onChange={e => setNumeroFattura(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Data (DD-MM-YYYY)</label>
                        <input
                            type="text"
                            value={data}
                            onChange={e => setData(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Cliente</h3>
                <div className="grid sm:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome e Cognome</label>
                        <input
                            type="text"
                            value={clienteNome}
                            onChange={e => setClienteNome(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">P.IVA</label>
                        <input
                            type="text"
                            value={clientePiva}
                            onChange={e => setClientePiva(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Indirizzo</label>
                        <input
                            type="text"
                            value={clienteIndirizzo}
                            onChange={e => setClienteIndirizzo(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Prodotti / Servizi</h3>
                <div className="space-y-6 mb-8">
                    {prodotti.map((item, i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm mb-1">Descrizione</label>
                                    <input
                                        type="text"
                                        value={item.descrizione}
                                        onChange={e => updateProdotto(i, "descrizione", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
                                    />
                                </div>
                                <div className="w-full sm:w-1/3">
                                    <label className="block text-sm mb-1">Quantità</label>
                                    <input
                                        type="number"
                                        value={item.quantita}
                                        onChange={e => updateProdotto(i, "quantita", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-300"
                                    />
                                </div>
                                <div className="w-full sm:w-1/3">
                                    <label className="block text-sm mb-1">Prezzo (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.prezzo}
                                        onChange={e => updateProdotto(i, "prezzo", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-300"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-right text-xl font-semibold mb-6">
                    Totale: € {totale}
                </div>


                <div className="text-center">
                    <button
                        //onClick={handleSaveAndContinue}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition
"
                    >
                        Salva e Prosegui
                    </button>
                </div>
            </div>
        </React.Fragment>
    );

}