// server/routes/fattura.js
import axios from "axios";
import { estraiDatiParziali, generaPromptFattura } from "../utils/promptBuilder.js";
import { enforceTotals } from "../utils/enforceTotals.js";

export async function generaFattura(req, res) {
    try {
        const { prompt: promptOriginale, supplier } = req.body;

        const parziali = await estraiDatiParziali(promptOriginale);
        const prompt = generaPromptFattura(parziali, promptOriginale, supplier);

        const g = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        let raw = g.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        raw = raw.replace(/```json\n?/gi, "").replace(/```/g, "").trim();
        const draft = JSON.parse(raw);

        //Dobbiamo calcolare il totale richiesto
        // Se l'IVA è inclusa e l'importo totale è fornito, lo utilizziamo
        // Altrimenti, rimane null

        //Quindi impostiamo una variabile per il totale richiesto
        let requestedTotal = null;


        if (parziali && parziali.ivaInclusa && parziali.importoTotale != null) {
            requestedTotal = Number(parziali.importoTotale); // allora requestedTotal = importoTotale 
        }


        const normalized = enforceTotals(draft, requestedTotal, 22);
        return res.json({ ok: true, data: normalized });
    } catch (err) {
        console.error("GENERA:", err?.response?.data || err.message);
        res.status(500).json({ ok: false, error: "GENERATION_FAILED" });
    }
}
