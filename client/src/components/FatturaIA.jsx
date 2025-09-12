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
    const toNum = (v) => {
        if (typeof v === "number") return v;
        if (!v) return 0;
        const s = String(v)
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(/,/g, ".")
            .replace(/[^\d.-]/g, "");
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    };

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
        return { descrizione, quantita, prezzo, totaleRiga };
    });

    // --- calcoli totali ---
    const imponibileCalc = righe.reduce((s, r) => s + r.totaleRiga, 0);
    const ivaCalc = imponibileCalc * (toNum(aliquotaIva) / 100);
    const totaleCalc = imponibileCalc + ivaCalc;

    const imponibile = toNum(impJSON) > 0 ? toNum(impJSON) : imponibileCalc;
    const iva = toNum(ivaJSON) >= 0 ? toNum(ivaJSON) : ivaCalc;
    const totale = toNum(totJSON) > 0 ? toNum(totJSON) : totaleCalc;

    function formatoEuro(value) {
        return Number(value || 0).toLocaleString("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    return (
        <div className="mt-8 p-6 border border-purple-300 bg-white rounded-xl shadow text-gray-800 fade-in max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
                Fattura n. {numeroFattura || "-"} del {data || "/"}
            </h2>

            {/* Info Cliente/Fornitore */}
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

            {/* Tabella prodotti */}
            <div className="overflow-x-auto mt-6">
                <table className="min-w-[500px] w-full border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-2 border-b">Descrizione</th>
                            <th className="text-right p-2 border-b">Quantità</th>
                            <th className="text-right p-2 border-b">Prezzo (€)</th>
                            <th className="text-right p-2 border-b">Totale (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {righe.map((r, i) => {
                            const totalToShow = Number(
                                r.totaleRiga && r.totaleRiga > 0 ? r.totaleRiga : r.quantita * r.prezzo
                            );
                            return (
                                <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b`}
                                >
                                    <td className="p-2">{r.descrizione}</td>
                                    <td className="p-2 text-right">{r.quantita}</td>
                                    <td className="p-2 text-right tabular-nums">
                                        {formatoEuro(r.prezzo)}
                                    </td>
                                    <td className="p-2 text-right bg-purple-100 font-medium tabular-nums">
                                        {formatoEuro(totalToShow)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Box Totali */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner text-sm sm:text-base max-w-md text-right flex flex-col gap-1 ml-auto ">
                <p><strong>Imponibile:</strong> {formatoEuro(imponibile)} €</p>
                <p><strong>IVA ({aliquotaIva}%):</strong> {formatoEuro(iva)} €</p>
                <p className="text-lg font-bold text-purple-700 mt-2">
                    Totale: {formatoEuro(totale)} €
                </p>
            </div>

            {/* Nota e branding */}
            <div className="mt-6 text-xs">
                *Nella pagina successiva potrai modificare i dettagli della fattura.
            </div>
            <p className="text-center text-xs text-gray-400 mt-6 italic">
                Generato automaticamente da <span className="text-purple-600 font-semibold">FatturIAmo</span>
            </p>
        </div>
    );
}
