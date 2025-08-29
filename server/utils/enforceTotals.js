export const round2 = n => Math.round((Number(n) + Number.EPSILON) * 100) / 100;


export function normalizzaFattura(fattura) {
    if (fattura.righe?.length) {
        const r = fattura.righe[0];
        const totale = fattura.vincoli?.totaleLordo;

        if (!r.prezzo && r.quantita && totale) {
            r.prezzo = round2(totale / r.quantita);
        }

        if (!r.tariffaOraria && r.ore && totale) {
            r.tariffaOraria = round2(totale / r.ore);
        }

        // Se mancano entrambi e c'è un totale, inventa qualcosa
        if (!r.prezzo && !r.quantita && totale) {
            r.quantita ??= 1;
            r.prezzo ??= round2(totale);

        }

        if (!r.tariffaOraria && !r.ore && totale) {
            r.ore = 1;
            r.tariffaOraria = round2(totale);
        }
    }
}

export function enforceTotals(fattura, totaleLordo, aliquotaIva = 22) {
    const d = JSON.parse(JSON.stringify(fattura));
    const vat = aliquotaIva / 100;

    // Normalizza i dati dei prodotti
    d.prodotti = (d.prodotti || []).map(p => ({
        ...p,
        quantita: Number(p.quantita) || 0,
        prezzo: Number(p.prezzo) || 0,
    }));

    // Calcola l'imponibile attuale
    let imponibile = round2(
        d.prodotti.reduce((acc, p) => acc + round2(p.quantita * p.prezzo), 0)
    );

    // Se è stato fornito un totale IVA inclusa (es. "500 euro IVA inclusa")
    if (totaleLordo && !isNaN(totaleLordo) && d.prodotti.length > 0) {
        const targetImponibile = round2(totaleLordo / (1 + vat));
        const lastIdx = d.prodotti.length - 1;
        const last = d.prodotti[lastIdx];

        // Calcola il totale delle altre righe
        const altreRighe = d.prodotti.slice(0, lastIdx);
        const altriTotali = round2(
            altreRighe.reduce((acc, p) => acc + round2(p.quantita * p.prezzo), 0)
        );

        const differenzaUltimaRiga = round2(targetImponibile - altriTotali);

        // Adatta il prezzo dell'ultima riga
        const quantitaUltima = last.quantita || 1;
        last.prezzo = round2(differenzaUltimaRiga / quantitaUltima);

        // Ricalcola l’imponibile dopo l’adattamento
        imponibile = round2(
            d.prodotti.reduce((acc, p) => acc + round2(p.quantita * p.prezzo), 0)
        );
    }

    // Applica i calcoli
    d.imponibile = imponibile;
    d.iva = round2(imponibile * vat);
    d.totale = round2(d.imponibile + d.iva);

    return d;
}