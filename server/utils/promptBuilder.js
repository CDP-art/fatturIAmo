// utils/promptBuilder.js

import axios from "axios";

// Funzione 1: Estrae campi utili dal testo utente libero usando Gemini
async function estraiDatiParziali(promptUtente) {

    const estrazionePrompt = `
Estrai dal seguente testo i campi per una fattura. Se un dato manca, lascialo null.

Rispondi solo con un oggetto JSON valido, senza testo prima o dopo, e senza blocchi di codice (niente triple backtick).

Campi richiesti:
- nomeCliente (string)
- importoTotale (number, usa il punto come separatore decimale)
- descrizioneServizio (string)
- data (string, formato DD-MM-YYYY)
- città (string)
- oreLavoro (number)

Testo utente: "${promptUtente}"
`.trim();

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: estrazionePrompt }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const resultRaw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!resultRaw) throw new Error("Gemini non ha restituito alcun contenuto");

        const cleaned = resultRaw
            .replace(/```json\n?/gi, '')
            .replace(/```/, '')
            .trim();
        return JSON.parse(cleaned);

    } catch (error) {
        console.error("Errore durante l'estrazione dei dati parziali:", error.response?.data || error.message);
        return null;
    }
}

// Funzione 2: Crea un prompt ben strutturato per generare il JSON finale della fattura
function generaPromptFattura(datiParziali, promptOriginale) {
    return `
Sei un assistente contabile. Genera una fattura realistica in formato JSON valido e ben indentato.

⚠️ Rispondi solo con il JSON. Niente testo prima o dopo, e non usare blocchi come \`\`\`json.

Il JSON deve contenere:
- numeroFattura (es: "001")
- data (formato "DD-MM-YYYY")
- cliente: oggetto con "nome", "piva", "indirizzo" (es: "Via Gaudenzio Ferrari 5, 10124 Torino (TO)")
- fornitore: oggetto con "nome", "piva", "indirizzo" (facoltativo)
- prodotti: array di oggetti con:
  - descrizione (es: "Sviluppo sito web - 24 Ore")
  - quantita (numero)
  - prezzo (numero, per unità)
- imponibile: numero
- iva: numero
- totale: numero

Regole da seguire:
- Se sono indicati giorni o settimane, converti in ore (1 giorno = 8h, 1 settimana = 40h)
- Se l’IVA non è specificata, considera che l’importo è con IVA inclusa
- Completa con dati realistici mancanti
- Se manca la città, inventala
- Se manca l’indirizzo completo, creane uno realistico
- L'indirizzo deve essere nel formato: "Via Nome, CAP Città"
- Tra i prodotti, includi sempre una voce per le ore lavorate, con descrizione contenente la parola "Ore"


---
Dati parziali estratti:
${JSON.stringify(datiParziali, null, 2)}

---
Testo utente originale:
"${promptOriginale}"
`.trim();
}

export { estraiDatiParziali, generaPromptFattura };
