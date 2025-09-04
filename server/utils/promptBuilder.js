import axios from "axios";

export async function estraiDatiParziali(promptUtente) {
  const estrazionePrompt = `
Estrai SOLO i seguenti campi in JSON valido. Se un campo non è presente, OMETTILO del tutto (non usare null).

Campi richiesti:
- nomeCliente (string)
- importoTotale (number)
- ivaInclusa (boolean)
- descrizioneServizio (string)
- data (string)
- citta (string)
- oreLavoro (number)

Rispondi SOLO con JSON valido, senza testo extra.
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
    let jsonText = raw.trim();

    if (!jsonText.startsWith("{")) {
      const m = jsonText.match(/\{[\s\S]*\}/);
      jsonText = m ? m[0] : "{}";
    }

    return JSON.parse(jsonText);
  } catch (e) {
    console.error("estraiDatiParziali:", e?.response?.data || e.message);
    return null;
  }
}

export function generaPromptFattura(datiParziali, promptOriginale, supplier) {
  const sup = supplier || {};
  return `
SEI UNO STRUMENTO CHE GENERA JSON STRUTTURATO. NON AGGIUNGERE COMMENTI O TESTO ESTERNO.

REGOLE:
- NON inventare servizi non richiesti.
- Se mancano dati di cliente/fornitore, usa nomi e indirizzi plausibili.
- Usa UNA SOLA riga se l'utente non specifica più voci.
- NON calcolare totali o IVA. Il server si occupa dei calcoli.
- Usa numeri veri (non stringhe) e la virgola per i decimali e il punto per le migliaia.
- Usa formato data DD/MM/YYYY se presente, altrimenti ometti il campo.
- Se un campo è sconosciuto, NON includerlo nel JSON (non usare null o 0).
- Restituisci SOLO i campi utili secondo lo schema seguente.

SCHEMA RICHIESTO:
{
  "numeroFattura": string?,
  "data": string?,
  "cliente": {
    "ragioneSociale": string,
    "piva": string?,
    "indirizzo": string?
  },
  "fornitore": {
    "ragioneSociale": ${JSON.stringify(sup.ragioneSociale)},
    "piva": ${JSON.stringify(sup.piva)},
    "indirizzo": ${JSON.stringify(sup.indirizzo)}
  },
  "righe": [
    {
      "descrizione": string,
      "ore": number,
      "tariffaOraria": number,
      "scontoPct": number?
    }
  ],
  "opzioni": {
    "aliquotaIvaPct": number
  },
  "vincoli": {
    "totaleLordo": number?
  },
  "note": string?
}

ISTRUZIONI:
- Ogni riga DEVE avere sia "ore" che "tariffaOraria". Se uno dei due manca, deducilo o imposta "ore": 1.
- Non mettere ore = 0 o tariffaOraria = 0, a meno che sia chiaramente gratuito.
- Se l'importo è espresso come "500 euro", e non è chiaro quante ore, metti "ore": 1, "tariffaOraria": 500.
- Se l’utente usa “quantità + prezzo”, converti in “ore + tariffaOraria”.
- Non includere righe incomplete: tutte le righe devono poter essere moltiplicate (ore × tariffa).
- Se l’utente specifica importi (es. 500 euro), questi devono essere usati esattamente come "tariffaOraria" o "prezzo".
- Non ignorare nessun prezzo presente nel testo.
- Se l’utente scrive "posa piastrelle 20 euro/h per 8 ore", genera:
  { descrizione: "posa piastrelle", ore: 8, tariffaOraria: 20 }

- Se l’utente scrive "piastrelle 20 euro/mq per 45 mq", genera:
  { descrizione: "piastrelle", ore: 45, tariffaOraria: 20 }

- Se l’utente scrive "manodopera 500 euro", genera:
  { descrizione: "manodopera", ore: 1, tariffaOraria: 500 }

NON omettere i prezzi presenti nel testo. Tutti i prezzi devono apparire nel JSON.
- Se l’utente specifica "totale 1500 euro IVA inclusa", metti "vincoli": { "totaleLordo": 1500 }.
- Se l’utente specifica "totale 1500 euro IVA esclusa", ometti "totaleLordo" (il server calcola l’IVA).
- Se l’utente specifica "aliquota IVA 10%", usa questo valore in "opzioni.aliquotaIvaPct".


---
Dati parziali estratti:
${JSON.stringify(datiParziali ?? {}, null, 2)}

---
Prompt utente:
${JSON.stringify(promptOriginale)}
  `.trim();
}

