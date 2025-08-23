// server/controllers/generaFattura.js
import axios from 'axios';
import { estraiDatiParziali, generaPromptFattura } from '../utils/promptBuilder.js';

// Funzione per pulire la risposta di Gemini (rimuove ```json ... ```)
function estraiJSON(text) {
    const cleaned = text
        .replace(/```json\n?/, '')
        .replace(/```/, '')
        .trim();
    return JSON.parse(cleaned);
}

async function generaFattura(req, res) {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt mancante' });
    }

    try {
        // 1. Estrai i dati principali dal prompt utente (nome cliente, totale, ecc.)
        const datiParziali = await estraiDatiParziali(prompt);

        if (!datiParziali) {
            throw new Error("Estrazione dati fallita");
        }

        // 2. Costruisci il prompt finale strutturato per Gemini
        const promptFinale = generaPromptFattura(datiParziali, prompt);

        // 3. Invia il prompt finale a Gemini per generare il JSON della fattura
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: promptFinale }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // resultRaw serve per ottenere il testo della risposta
        const resultRaw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultRaw) {
            throw new Error("Risposta Gemini vuota o non valida");
        }

        // 4. Pulisci la risposta e ottieni l’oggetto JSON finale
        const result = estraiJSON(resultRaw);

        // 5. Invia il risultato al frontend
        res.json({ result });

    } catch (error) {
        console.error("Errore durante la generazione della fattura:", error.response?.data || error.message);
        res.status(500).json({ error: 'Errore nella generazione della fattura' });
    }
}

export { generaFattura };
