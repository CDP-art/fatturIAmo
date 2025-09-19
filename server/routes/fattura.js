// server/routes/fattura.js
import axios from "axios";
import { estraiDatiParziali, generaPromptFattura } from "../utils/promptBuilder.js";
import { enforceTotals, normalizzaFattura, round2, coerceNumber } from "../utils/enforceTotals.js";

/**
 * Come coerceNumber, ma con fallback a 0 (utile per prezzi riga).
 * Così, se non riesco a leggere il numero, metto 0 e non rompo i calcoli.
 */
function parsePrezzo(val) {
    const n = coerceNumber(val);
    return n == null ? 0 : n;
}

export async function generaFattura(req, res) {
    try {
        const { prompt: promptOriginale, supplier } = req.body;

        // 1) Estrazione veloce di flag/valori (es. ivaInclusa, importoTotale, ecc.)
        const parziali = (await estraiDatiParziali(promptOriginale)) || {};

        // 2) Prompt strutturato per ottenere la bozza JSON della fattura
        const prompt = generaPromptFattura(parziali, promptOriginale, supplier);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                response_mime_type: "application/json",
                temperature: 0.1,
                maxOutputTokens: 800,
            },
        };

        // 3) Chiamata a Gemini (proxy:false per evitare problemi di rete aziendali)
        const g = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
            proxy: false,
        });

        // 4) Parsing sicuro del JSON (tento di prendere solo il blocco {})
        let raw = g.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        let jsonText = String(raw || "").trim();
        if (!jsonText.startsWith("{")) {
            const m = jsonText.match(/\{[\s\S]*\}/);
            jsonText = m ? m[0] : "{}";
        }

        let draft;
        try {
            draft = JSON.parse(jsonText);
            // Normalizzazione CONSERVATIVA: non tocca prezzi già presenti
            normalizzaFattura(draft);
        } catch {
            console.error("Parse Gemini JSON failed:", jsonText);
            return res.status(502).json({ ok: false, error: "INVALID_AI_JSON" });
        }

        // 5) Mappo righe -> prodotti { descrizione, quantita, prezzo }
        let prodotti = [];
        if (Array.isArray(draft?.righe)) {
            prodotti = draft.righe.map((r, i) => {
                const descrizione = r?.descrizione || `Voce ${i + 1}`;
                const quantita = Number(r?.ore ?? r?.quantita ?? 1);
                const prezzo = parsePrezzo(
                    r?.prezzo ?? r?.tariffaOraria ?? r?.prezzoUnitario ?? r?.prezzoOrario
                );
                return {
                    descrizione,
                    quantita,
                    prezzo, // lordo o netto a seconda del flag prezziIvaInclusa
                    totaleRiga: round2(quantita * prezzo),
                };
            });
        }

        const draftForEnforce = { ...draft, prodotti };

        // 6) Totale richiesto (IVA inclusa), se presente
        //    priorità: parziali (ivaInclusa + importoTotale) -> vincoli.totaleLordo
        let requestedTotal = null;
        if (parziali?.ivaInclusa === true) {
            const n = coerceNumber(parziali?.importoTotale);
            if (n != null) requestedTotal = n;
        }
        if (requestedTotal == null) {
            const n = coerceNumber(draft?.vincoli?.totaleLordo);
            if (n != null) requestedTotal = n;
        }

        // 7) Flag: prezzi di riga già IVA inclusa?
        let prezziIvaInclusa =
            Boolean(parziali?.ivaInclusa) || Boolean(draft?.opzioni?.prezziIvaInclusa);

        // Heuristica: se ho un requestedTotal e la somma righe coincide ~, assumo che i prezzi siano lordi
        if (!prezziIvaInclusa && requestedTotal != null && Array.isArray(prodotti) && prodotti.length) {
            const sommaRighe = prodotti.reduce((acc, p) => acc + p.totaleRiga, 0);
            if (Math.abs(sommaRighe - requestedTotal) <= 0.01) {
                prezziIvaInclusa = true;
            }
        }

        // passo il flag a enforceTotals
        draftForEnforce.opzioni = { ...(draftForEnforce.opzioni || {}), prezziIvaInclusa };
        const aliquota = Number(draft?.opzioni?.aliquotaIvaPct ?? 22);

        // 8) Calcolo finale totali
        const normalized = enforceTotals(draftForEnforce, requestedTotal, aliquota);

        // 9) Compatibilità: mantengo sia prodotti che righe
        normalized.prodotti = normalized.prodotti || normalized.righe || [];
        normalized.righe = normalized.prodotti;

        // 10) Risposta
        return res.json({ ok: true, data: normalized });
    } catch (err) {
        // provo a dare un errore "parlante" al frontend
        const status = err?.response?.status;
        const code =
            status === 429
                ? "QUOTA_EXCEEDED"
                : status === 503
                    ? "UPSTREAM_UNAVAILABLE"
                    : err?.code === "ETIMEDOUT"
                        ? "UPSTREAM_TIMEOUT"
                        : err?.code === "ECONNRESET"
                            ? "UPSTREAM_NETWORK"
                            : "GENERATION_FAILED";

        if (process.env.NODE_ENV !== 'production') {
            console.error("GENERA:", err?.response?.data || err);
        }
        return res.status(502).json({ ok: false, error: code });
    }
}
