// utils/enforceTotals.js

// Arrotonda a 2 decimali in modo sicuro
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/**
 * Converte stringhe tipo "1.000,50" in numeri. Restituisce null se non parsabile.
 * (ora è esportata per riuso fuori da questo file)
 */
export function coerceNumber(val) {
    if (val == null) return null;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
        const cleaned = val.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
        const n = Number(cleaned);
        return Number.isNaN(n) ? null : n;
    }
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
}

/**
 * Normalizza la bozza SENZA sovrascrivere prezzi già presenti.
 * Usa vincoli.totaleLordo solo se:
 * - c'è 1 sola riga
 * - e quella riga NON ha già un prezzo (prezzo/tariffa).
 */
export function normalizzaFattura(fattura) {
    const totale = fattura?.vincoli?.totaleLordo;
    const righe = Array.isArray(fattura?.righe) ? fattura.righe : [];
    if (!righe.length || totale == null) return;

    if (righe.length === 1) {
        const r = righe[0];

        const haPrezzo =
            r?.prezzo != null || r?.tariffaOraria != null || r?.prezzoUnitario != null;

        if (!haPrezzo) {
            if (r.quantita && !r.prezzo) {
                r.prezzo = round2(totale / r.quantita);
            } else if (r.ore && !r.tariffaOraria) {
                r.tariffaOraria = round2(totale / r.ore);
            } else if (!r.quantita && !r.ore) {
                r.quantita = 1;
                r.prezzo = round2(totale);
            }
        }
    }
}

/**
 * Calcola imponibile, IVA e totale della fattura.
 * Modalità:
 * - NETTO (default): prezzi riga = imponibile
 * - LORDO (prezziIvaInclusa = true): prezzi riga includono già IVA
 *
 * Se esiste un totale lordo richiesto:
 * - in NETTO si adegua SOLO l'ultima riga (evitando negativi)
 * - in LORDO non si toccano le righe; il totale è la somma dei lordi (o il valore richiesto).
 */
export function enforceTotals(fattura, totaleLordo, aliquotaIva = 22) {
    const d = JSON.parse(JSON.stringify(fattura));
    const vat = Number(aliquotaIva) / 100;

    // Fallback: leggi vincoli.totaleLordo se non passato
    if ((totaleLordo == null || Number.isNaN(totaleLordo)) && d?.vincoli?.totaleLordo != null) {
        const n = coerceNumber(d.vincoli.totaleLordo);
        if (n != null) totaleLordo = n;
    }

    const prezziIvaInclusa = Boolean(d?.opzioni?.prezziIvaInclusa);

    // Normalizza array prodotti (copio i campi utili e pulisco i numeri)
    d.prodotti = (d.prodotti || []).map((p) => ({
        ...p,
        quantita: Number(p.quantita) || 0,
        prezzo: Number(p.prezzo) || 0, // interpretazione: netto o lordo in base al flag
    }));

    // Calcoli
    let imponibile = 0;

    if (prezziIvaInclusa) {
        // Prezzi di riga sono LORDI: li converto a NETTI e salvo entrambi
        d.prodotti = d.prodotti.map((p) => {
            const prezzoLordo = p.prezzo;
            const prezzoNetto = round2(prezzoLordo / (1 + vat));
            return {
                ...p,
                prezzoLordo,
                prezzo: prezzoNetto, // d'ora in poi `prezzo` è NETTO per i calcoli
                totaleRigaNetto: round2(p.quantita * prezzoNetto),
                totaleRigaLordo: round2(p.quantita * prezzoLordo),
            };
        });

        // Imponibile = somma netti; totale lordo = somma lordi (o il valore richiesto)
        imponibile = round2(d.prodotti.reduce((acc, p) => acc + p.totaleRigaNetto, 0));

        const sommaLordi = round2(d.prodotti.reduce((acc, p) => acc + p.totaleRigaLordo, 0));
        const totaleFinaleLordo =
            totaleLordo != null && !Number.isNaN(totaleLordo) ? Number(totaleLordo) : sommaLordi;

        d.imponibile = imponibile;
        d.iva = round2(totaleFinaleLordo - imponibile);
        d.totale = round2(totaleFinaleLordo);

        return d;
    }

    // Prezzi NETTI (default)
    imponibile = round2(
        d.prodotti.reduce((acc, p) => acc + round2(p.quantita * p.prezzo), 0)
    );

    // Se c'è un totale lordo richiesto, adeguo solo l'ultima riga (senza andare sotto zero)
    if (totaleLordo != null && !Number.isNaN(totaleLordo) && d.prodotti.length > 0) {
        const targetImponibile = round2(totaleLordo / (1 + vat));
        const lastIdx = d.prodotti.length - 1;

        const altreRighe = d.prodotti.slice(0, lastIdx);
        const altriTotali = round2(
            altreRighe.reduce((acc, p) => acc + round2(p.quantita * p.prezzo), 0)
        );

        const differenzaUltimaRiga = round2(targetImponibile - altriTotali);
        const last = d.prodotti[lastIdx];
        const quantitaUltima = last.quantita || 1;
        const nuovoPrezzo = round2(differenzaUltimaRiga / quantitaUltima);

        if (nuovoPrezzo >= 0) {
            last.prezzo = nuovoPrezzo;
            // ricalcolo imponibile
            imponibile = round2(
                d.prodotti.reduce((acc, p) => acc + round2(p.quantita * p.prezzo), 0)
            );
        }
    }

    d.imponibile = imponibile;
    d.iva = round2(imponibile * vat);
    d.totale = round2(d.imponibile + d.iva);

    return d;
}
