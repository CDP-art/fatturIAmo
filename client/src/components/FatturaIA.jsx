export default function FatturaIA({ rawOutput }) {
    let parsed;
    try {
        const raw = typeof rawOutput === "string" ? JSON.parse(rawOutput) : rawOutput;
        parsed = typeof raw.data === "object" && raw.data !== null ? raw.data : raw;
    } catch {
        return <div>⚠️ Errore: JSON non valido.</div>;
    }

    const {
        numeroFattura,
        data,
        cliente,
        fornitore,
        aliquotaIva = 22,
        imponibile: impJSON,
        iva: ivaJSON,
        totale: totJSON,
    } = parsed || {};

    let prodotti = [];
    if (Array.isArray(parsed?.prodotti) && parsed.prodotti.length > 0) {
        prodotti = parsed.prodotti;
    } else if (Array.isArray(parsed?.righe) && parsed.righe.length > 0) {
        prodotti = parsed.righe;
    }


    // --- funzioni BASILARI di supporto ---
    // Trasforma "500", "500,00", "€500,00" -> 500
    const toNum = (v) => {
        if (typeof v === "number") return v;
        if (!v) return 0;
        const s = String(v)
            .replace(/\s/g, "")
            .replace(/\./g, "")   // migliaia
            .replace(/,/g, ".")   // decimali
            .replace(/[^\d.-]/g, "");
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    };

    // Nome cliente: supporta più formati
    const nomeCliente =
        typeof cliente === "string"
            ? cliente
            : cliente?.nome ||
            cliente?.ragioneSociale ||
            cliente?.denominazione ||
            cliente?.ragione_sociale ||
            "—";

    // --- normalizzo le righe ---
    const righe = prodotti.map((p, i) => {
        const descrizione = p.descrizione || p.nome || p.titolo || `Voce ${i + 1}`;
        const quantita = toNum(p.quantita ?? p.qty ?? p.ore ?? 1);
        const prezzo = toNum(p.prezzo ?? p.tariffaOraria ?? p.prezzoUnitario ?? p.prezzoOrario);
        const totaleRiga = toNum(p.totaleRiga ?? prezzo * quantita);

        const rigaFinale = { descrizione, quantita, prezzo, totaleRiga };

        return rigaFinale;
    });


    // --- calcoli totali ---
    const imponibileCalc = righe.reduce((s, r) => s + r.totaleRiga, 0);
    const ivaCalc = imponibileCalc * (toNum(aliquotaIva) / 100);
    const totaleCalc = imponibileCalc + ivaCalc;

    // se nel JSON ci sono già valori sensati, li mostro; altrimenti uso i calcolati
    const imponibile = toNum(impJSON) > 0 ? toNum(impJSON) : imponibileCalc;
    const iva = toNum(ivaJSON) >= 0 ? toNum(ivaJSON) : ivaCalc;
    const totale = toNum(totJSON) > 0 ? toNum(totJSON) : totaleCalc;

    return (
        <div className="mt-8 p-6 border border-purple-300 bg-white rounded-xl shadow text-gray-800 fade-in max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
                Fattura n. {numeroFattura || "-"} del {data || "/"}
            </h2>

            <div className="mb-6 text-sm space-y-3">
                <div>
                    <h4 className="text-gray-500 font-semibold uppercase text-xs">Cliente</h4>
                    <p>
                        <strong>{nomeCliente}</strong>
                        {typeof cliente === "object" && cliente?.piva ? ` - P.IVA ${cliente.piva}` : ""}
                    </p>
                    {typeof cliente === "object" && cliente?.indirizzo && <p>{cliente.indirizzo}</p>}
                </div>

                <div>
                    <h4 className="text-gray-500 font-semibold uppercase text-xs">Fornitore</h4>
                    <p>
                        <strong>{fornitore?.nome || "—"}</strong>
                        {fornitore?.piva && ` - P.IVA ${fornitore.piva}`}
                    </p>
                    {fornitore?.indirizzo && <p>{fornitore.indirizzo}</p>}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-1 border-b">Descrizione</th>
                            <th className="text-right p-1 border-b">Quantità</th>
                            <th className="text-right p-1 border-b">Prezzo (€)</th>
                            <th className="text-right p-1 border-b">Totale (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {righe.map((r, i) => {
                            const totalToShow = Number(
                                r.totaleRiga && r.totaleRiga > 0 ? r.totaleRiga : r.quantita * r.prezzo
                            );

                            return (
                                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="p-2">{r.descrizione}</td>
                                    <td className="p-2 text-right">{r.quantita}</td>
                                    <td className="p-2 text-right">
                                        {r.prezzo.toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="p-2 text-right bg-purple-100 font-medium">
                                        {totalToShow.toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <hr className="mt-10 mb-4 border-t border-gray-200" />

            <div className="text-sm text-right text-gray-600">
                Imponibile: {imponibile.toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} € – IVA: {iva.toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </div>
            <div className="text-right text-lg font-bold text-purple-700 mt-2">
                Totale: {totale.toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} €
            </div>

            <div className="mt-6 text-xs">
                *Nella pagina successiva potrai modificare i dettagli della fattura.
            </div>
        </div>
    );
}
