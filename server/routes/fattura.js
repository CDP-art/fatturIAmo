// server/routes/fattura.js
import axios from "axios";
import { estraiDatiParziali, generaPromptFattura } from "../utils/promptBuilder.js";
import { enforceTotals, normalizzaFattura } from "../utils/enforceTotals.js";

export async function generaFattura(req, res) {
    try {
        const { prompt: promptOriginale, supplier } = req.body;

        const parziali = await estraiDatiParziali(promptOriginale);
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

        const g = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        });

        let raw = g.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        //console.log("📦 RISPOSTA GEMINI RAW:\n", raw);

        let jsonText = (raw || "").trim();
        if (!jsonText.startsWith("{")) {
            const m = jsonText.match(/\{[\s\S]*\}/);
            jsonText = m ? m[0] : "{}";
        }
        let draft;
        try {
            draft = JSON.parse(jsonText);
            normalizzaFattura(draft); // 🛠 normalizza subito dopo il parsing
        } catch (e) {
            console.error("Parse Gemini JSON failed:", jsonText);
            return res.status(502).json({ ok: false, error: "INVALID_AI_JSON" });
        }

        const prodotti = Array.isArray(draft?.righe) ? draft.righe.map(
            r => ({
                descrizione: r?.descrizione || "",
                quantita: Number(r?.ore ?? r?.quantita ?? 0),
                prezzo: Number(r?.tariffaOraria ?? r?.prezzo ?? 0),
            }))
            : Array.isArray(draft?.prodotti) ? draft.prodotti.map(
                p => ({
                    descrizione: p?.descrizione || "",
                    quantita: Number(p?.quantita ?? 0),
                    prezzo: Number(p?.prezzo ?? 0),
                }))
                : [];


        const draftForEnforce = { ...draft, prodotti };

        //Dobbiamo calcolare il totale richiesto
        // Se l'IVA è inclusa e l'importo totale è fornito, lo utilizziamo
        // Altrimenti, rimane null

        //Quindi impostiamo una variabile per il totale richiesto
        let requestedTotal = null;


        if (parziali && parziali.ivaInclusa && parziali.importoTotale != null) {
            requestedTotal = Number(parziali.importoTotale); // allora requestedTotal = importoTotale 
        }


        const aliquota = Number(draft?.opzioni?.aliquotaIvaPct ?? 22);
        const normalized = enforceTotals(draftForEnforce, requestedTotal, aliquota);

        return res.json({ ok: true, data: normalized });
    } catch (err) {
        console.error("GENERA:", err?.response?.data || err.message);
        res.status(500).json({ ok: false, error: "GENERATION_FAILED" });
    }
}
