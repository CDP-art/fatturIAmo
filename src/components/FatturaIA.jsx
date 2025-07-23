import React from "react";

export default function FatturaIA({ rawOutput }) {
    let parsed;

    try {
        parsed = typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput;
    } catch (error) {
        return (
            <div className="mt-8 p-4 border border-red-300 bg-red-50 rounded-xl text-red-800">
                ⚠️ Errore: il contenuto generato non è un JSON valido.
            </div>
        );
    }

    // Estrai i campi corretti dal JSON
    const {
        numeroFattura,
        data,
        cliente,
        fornitore,
        prodotti,
        imponibile,
        iva,
        totale,
    } = parsed;


    return (
        <div className="mt-8 p-6 border border-purple-300 bg-white rounded-xl shadow text-gray-800">
            <h2 className="text-xl font-bold mb-4">
                Fattura n. {numeroFattura || "-"} del {data || "-"}
            </h2>

            <div className="mb-4">
                <p><strong>Cliente:</strong> {cliente?.nome || "Nome mancante"} - P.IVA {cliente?.piva || "-"}</p>
                {fornitore && (
                    <p><strong>Fornitore:</strong> {fornitore.nome || "-"} - P.IVA {fornitore.piva || "-"}</p>
                )}
            </div>

            <table className="w-full border border-gray-300 mb-4 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Descrizione</th>
                        <th className="p-2 border">Quantità</th>
                        <th className="p-2 border">Prezzo (€)</th>
                    </tr>
                </thead>
                <tbody>
                    {prodotti && prodotti.length > 0 ? (
                        prodotti.map((item, index) => (
                            <tr key={index}>
                                <td className="p-2 border">{item.descrizione || "-"}</td>
                                <td className="p-2 border text-center">{item.quantità || 1}</td>
                                <td className="p-2 border text-right">
                                    {item.prezzo != null ? item.prezzo.toFixed(2) : "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-2 border text-center" colSpan="3">
                                Nessun prodotto o servizio inserito.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="text-right text-sm text-gray-600 mb-2">
                Imponibile: {imponibile || "-"} € – IVA: {iva || "-"} €
            </div>

            <div className="text-right font-semibold text-lg">
                Totale: {totale != null ? `${totale.toFixed(2)} €` : "-"}
            </div>
        </div>
    );
}
