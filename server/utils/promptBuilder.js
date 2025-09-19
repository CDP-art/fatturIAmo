// utils/promptBuilder.js
import axios from "axios";

export async function estraiDatiParziali(promptUtente) {
  // 1) Leggo e pulisco la API key
  const key = (process.env.GEMINI_API_KEY || "").trim();

  if (!key) {
    // in produzione non loggo dettagli
    if (process.env.NODE_ENV !== 'production') {
      console.error("estraiDatiParziali: GEMINI_API_KEY mancante o vuota");
    }
    // ritorno un oggetto vuoto così non rompo il flusso a valle
    return {};
  }

  // 2) Costruisco la URL in modo sicuro
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
    key
  )}`;

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
      // 3) Bypasso eventuali proxy di sistema non validi
      proxy: false,
    });

    const raw = r.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    let jsonText = String(raw).trim();

    // se per caso c'è testo extra, provo a prendere solo il blocco {}
    if (!jsonText.startsWith("{")) {
      const m = jsonText.match(/\{[\s\S]*\}/);
      jsonText = m ? m[0] : "{}";
    }

    return JSON.parse(jsonText);
  } catch (e) {
    // Log utile ma sicuro (non stampa la key)
    const safeUrl = url.replace(/key=.+$/, "key=***");
    console.error("estraiDatiParziali ERROR:", {
      name: e?.name,
      message: e?.message,
      code: e?.code || e?.cause?.code,
      url: safeUrl,
    });
    // fallback sicuro
    return {};
  }
}

export function generaPromptFattura(datiParziali, promptOriginale, supplier) {
  const sup = supplier || {};
  return `
SEI UNO STRUMENTO CHE GENERA JSON STRUTTURATO.NON AGGIUNGERE COMMENTI O TESTO ESTERNO.

REGOLE:
- NON inventare servizi non richiesti.
- Se mancano dati di cliente / fornitore, usa nomi e indirizzi plausibili.
- Usa UNA SOLA riga se l'utente non specifica più voci.
- NON calcolare totali o IVA.Il server si occupa dei calcoli.
- Usa numeri veri(non stringhe) e la virgola per i decimali e il punto per le migliaia.
- Usa formato data DD / MM / YYYY se presente, altrimenti ometti il campo.
- Se un campo è sconosciuto, NON includerlo nel JSON(non usare null o 0).
- Restituisci SOLO i campi utili secondo lo schema seguente.

SCHEMA RICHIESTO:
    {
      "numeroFattura": string ?,
        "data": string ?,
          "cliente": {
        "ragioneSociale": string,
          "piva": string ?,
            "indirizzo": string ?
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
          "scontoPct": number ?
    }
      ],
        "opzioni": {
        "aliquotaIvaPct": number,
          "prezziIvaInclusa": boolean ?
  },
      "vincoli": {
        "totaleLordo": number ?
  },
      "note": string ?
}

    ISTRUZIONI:
    - Ogni riga DEVE avere sia "ore" che "tariffaOraria".Se uno dei due manca, deducilo o imposta "ore": 1.
    - Non mettere ore = 0 o tariffaOraria = 0, a meno che sia chiaramente gratuito.
    - Se l'importo è espresso come "500 euro", e non è chiaro quante ore, metti "ore": 1, "tariffaOraria": 500.
    - Se l’utente usa “quantità + prezzo”, converti in “ore + tariffaOraria”.
    - Non includere righe incomplete: tutte le righe devono poter essere moltiplicate(ore × tariffa).
    - Se l’utente specifica importi(es. 500 euro), questi devono essere usati esattamente come "tariffaOraria" o "prezzo".
    - NON ignorare nessun prezzo presente nel testo.

      ESEMPI:
    - "posa piastrelle 20 euro/h per 8 ore" -> { descrizione: "posa piastrelle", ore: 8, tariffaOraria: 20 }
    - "piastrelle 20 euro/mq per 45 mq" -> { descrizione: "piastrelle", ore: 45, tariffaOraria: 20 }
    - "manodopera 500 euro" -> { descrizione: "manodopera", ore: 1, tariffaOraria: 500 }

REGOLE IVA:
    - Se l’utente specifica un importo con "IVA inclusa"(es. "totale 1500 euro IVA inclusa" o "100 iva inclusa"), metti SEMPRE "vincoli": { "totaleLordo": <importo> }.
    - Se l’utente dichiara che "tutti i prezzi sono IVA inclusa" (es. "tutto IVA inclusa", "prezzi IVA inclusa"), aggiungi anche: "opzioni": {"prezziIvaInclusa": true }.
    - Se l’utente specifica "totale 1500 euro IVA esclusa", ometti "vincoli.totaleLordo" (il server calcola l’IVA).
    - Se l’utente specifica "aliquota IVA 10%", usa questo valore in "opzioni.aliquotaIvaPct".

          ---
          Dati parziali estratti:
          ${JSON.stringify(datiParziali ?? {}, null, 2)}

          ---
          Prompt utente:
          ${JSON.stringify(promptOriginale)}
          `.trim();
}
