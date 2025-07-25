// FatturaIA.jsx
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
    console.log("Parsed FatturaIA:", parsed);

    return (
        <div className="mt-8 p-6 border border-purple-300 bg-white rounded-xl shadow text-gray-800">
            <h2 className="text-xl font-bold mb-4">
                Fattura n. {numeroFattura || "-"} del {data || "-"}
            </h2>

            <div className="mb-6 text-sm space-y-3">
                <div>
                    <h4 className="text-gray-500 font-semibold uppercase text-xs">Cliente</h4>
                    <p>
                        <strong>{cliente?.nome || "—"}</strong>{cliente?.piva && ` - P.IVA ${cliente.piva}`}
                    </p>
                    {cliente?.indirizzo && <p className="text-gray-600">{cliente.indirizzo}</p>}
                </div>

                <div>
                    <h4 className="text-gray-500 font-semibold uppercase text-xs">Fornitore</h4>
                    <p>
                        <strong>{fornitore?.nome || "—"}</strong>{fornitore?.piva && ` - P.IVA ${fornitore.piva}`}
                    </p>
                    {fornitore?.indirizzo && <p className="text-gray-600">{fornitore.indirizzo}</p>}
                </div>
            </div>



            <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2 border-b">Descrizione</th>
                        <th className="text-right p-2 border-b">Quantità</th>
                        <th className="text-right p-2 border-b">Prezzo (€)</th>
                    </tr>
                </thead>
                <tbody>
                    {prodotti.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="p-2">{item.descrizione}</td>
                            <td className="p-2 text-right">{item.quantita}</td>
                            <td className="p-2 text-right">{item.prezzo.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr className="mt-10 mb-4 border-t border-gray-200" />

            <div className="text-sm text-right text-gray-600">
                Imponibile: {imponibile?.toFixed(2) || "-"} € - IVA: {iva?.toFixed(2) || "-"} €
            </div>
            <div className="text-right text-lg font-bold text-purple-700 mt-2">
                Totale: {totale.toFixed(2)} €
            </div>
            <div className="mt-6 text-xs text-gray-800">
                *Nella pagina successiva potrai modificare i dettagli della fattura, se necessario.
            </div>
            <div className="mt-2 text-xs text-gray-500">
                Generato automaticamente da Fattur<span className="text-purple-600">IA</span>mo
            </div>
        </div>
    );
}
