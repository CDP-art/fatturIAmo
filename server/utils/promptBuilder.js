import axios from "axios";

export async function estraiDatiParziali(promptUtente) {
  const estrazionePrompt = `
Estrarre SOLO i campi richiesti in JSON valido. Se un campo manca, usa null.

Campi:
- nomeCliente (string|null)
- importoTotale (number|null)        // cifra principale menzionata
- ivaInclusa (boolean|null)          // true se "iva inclusa/compresa", false se "iva esclusa", altrimenti null
- descrizioneServizio (string|null)
- data (string|null)                 // qualsiasi formato trovato, non trasformare
- citta (string|null)
- oreLavoro (number|null)

Rispondi SOLO con JSON, senza testo extra.
Testo: ${JSON.stringify(promptUtente)}
  `.trim();

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: estrazionePrompt }] }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.1,
        maxOutputTokens: 300,
      },
    };
    const r = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 12000,
    });

    const raw = r.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    let jsonText = (raw || "").trim();

    if (!jsonText.startsWith("{")) {
      const m = jsonText.match(/\{[\s\S]*\}/);
      jsonText = m ? m[0] : "{}";
    }

    const obj = JSON.parse(jsonText);
    // return EstrSchema.parse(obj); // se usi Zod
    return obj;
  } catch (e) {
    console.error("estraiDatiParziali:", e?.response?.data || e.message);
    return null;
  }
}


/** Costruisce il prompt finale per la fattura JSON */
export function generaPromptFattura(datiParziali, promptOriginale, supplier) {
  const sup = supplier || {};
  return `
SEI UNO STRUMENTO CHE PRODUCE DATI STRUTTURATI. NON AGGIUNGERE TESTO FUORI DAL JSON.

REGOLE:
- NON inventare servizi non richiesti.
- Se mancano dati di cliente/fornitore, riempili utilizzando dati reali. Sia di nomi e sia di indirizzi.
- Usa UNA SOLA riga se l'utente non chiede più voci per i servizi
- Non calcolare totali; i calcoli li fa il server.
- Usa numeri (non stringhe) e il punto come separatore decimale.
- Data in formato ISO DD/MM/YYYY se presente o ricavabile, altrimenti null.
- IVA di default 22% salvo indicazioni esplicite.
- OUTPUT SOLO JSON valido, senza testo extra.

SCHEMA OBBLIGATORIO:
{
  "numeroFattura": null,
  "data": "DD/MM/YYYY" | null,
  "cliente": { "ragioneSociale": string|null, "piva": string|null, "indirizzo": string|null },
  "fornitore": { "ragioneSociale": ${JSON.stringify(sup.ragioneSociale ?? null)}, "piva": ${JSON.stringify(sup.piva ?? null)}, "indirizzo": ${JSON.stringify(sup.indirizzo ?? null)} },
  "righe": [
    { "descrizione": string, "ore": number, "tariffaOraria": number, "scontoPct": number|null }
  ],
  "opzioni": {
    "aliquotaIvaPct": number,          // default 22
    "regimeForfettario": boolean|null, // default false
    "ritenutaPct": number|null,        // se non menzionata -> null
    "cassaPct": number|null            // se non menzionata -> null
  },
  "vincoli": {
    "totaleLordo": number|null         // se "ivaInclusa" è true e "importoTotale" esiste, metti quel valore; altrimenti null
  },
  "note": string|null
}

ISTRUZIONI SPECIFICHE:
- Se l'utente parla di "quantità" ma intende ore, mappa "quantità" -> "ore".
- Se "ivaInclusa" è true e c'è "importoTotale", NON calcolare tu l'imponibile: imposta "vincoli.totaleLordo" a quel numero.
- "descrizione" deve essere chiara ma concisa (niente marketing).
- "scontoPct": se non citato uno sconto, usa null.

ESEMPIO (solo per forma, NON copiarlo alla lettera):
{
  "numeroFattura": null,
  "data": "2025-08-27",
  "cliente": { "ragioneSociale": "ACME Srl", "piva": "IT12345678901", "indirizzo": "N/D" },
  "fornitore": { "ragioneSociale": ${JSON.stringify(sup.ragioneSociale ?? null)}, "piva": ${JSON.stringify(sup.piva ?? null)}, "indirizzo": ${JSON.stringify(sup.indirizzo ?? null)} },
  "righe": [
    { "descrizione": "Sviluppo web - refactoring componente", "ore": 12, "tariffaOraria": 60, "scontoPct": null }
  ],
  "opzioni": { "aliquotaIvaPct": 22, "regimeForfettario": false, "ritenutaPct": null, "cassaPct": null },
  "vincoli": { "totaleLordo": null },
  "note": null
}

---
Dati parziali rilevati:
${JSON.stringify(datiParziali ?? {}, null, 2)}

---
Testo utente:
${JSON.stringify(promptOriginale)}
  `.trim();
}

