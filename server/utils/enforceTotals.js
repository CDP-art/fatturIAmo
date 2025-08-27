// server/utils/enforceTotals.js
export const round2 = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/**
 * Se requestedTotalInclVat è valorizzato (es. 1300 IVA inclusa),
 * adegua SOLO l’ultima riga per far tornare i conti.
 * vatRate default 22.
 */
export function enforceTotals(draft, requestedTotalInclVat, vatRate = 22) {
    const d = JSON.parse(JSON.stringify(draft));
    const vat = (vatRate ?? 22) / 100;

    d.prodotti = (d.prodotti || []).map(p => ({
        ...p,
        quantita: Number(p.quantita) || 0,
        prezzo: Number(p.prezzo) || 0, // ex IVA
    }));

    let imponibile = round2(d.prodotti.reduce((a, p) => a + round2(p.quantita * p.prezzo), 0));

    if (!requestedTotalInclVat || isNaN(requestedTotalInclVat) || !d.prodotti.length) {
        d.imponibile = imponibile;
        d.iva = round2(imponibile * vat);
        d.totale = round2(d.imponibile + d.iva);
        return d;
    }

    const targetEx = round2(requestedTotalInclVat / (1 + vat));

    if (imponibile !== targetEx) {
        const lastIdx = d.prodotti.length - 1;
        const last = d.prodotti[lastIdx];
        const others = round2(imponibile - round2(last.quantita * last.prezzo));
        const lastLineEx = round2(targetEx - others);
        const q = last.quantita || 1;
        last.prezzo = round2(lastLineEx / q);
    }

    d.imponibile = round2(d.prodotti.reduce((a, p) => a + round2(p.quantita * p.prezzo), 0));
    d.iva = round2(d.imponibile * vat);
    d.totale = round2(d.imponibile + d.iva);
    return d;
}
