

// generare un prompt completo da inviare a Gemini
//Quindi creare una funzione che riceve il prompt del cliente
//e bisogna trasformarlo in un oggetto JSON
// e inviarlo al server per la generazione della fattura

export function generaPrompt(richiestaUtente) {
  return `
Rispondi in formato **JSON valido** con i seguenti campi:

- numeroFattura (es. "001")
- data (formato "YYYY-MM-DD")
- cliente: oggetto con "nome", "piva", "indirizzo", "cap", "città"
- fornitore: oggetto con "nome" e "piva"
- prodotti: array di oggetti con "descrizione", "quantita", "prezzo"
- imponibile: numero
- iva: numero
- totale: numero

🔢 I calcoli devono essere corretti:
- Il totale è IVA **inclusa**
- L'IVA è al 22% e deve essere scorporata dal totale
- Il campo **imponibile = totale / 1.22**, arrotondato a 2 decimali
- L'IVA è la differenza tra totale e imponibile

📋 I prodotti devono essere coerenti con l'importo totale indicato dall'utente, sia come quantità che prezzo unitario.

🏷️ Se l’utente parla di ore lavorative, la quantità deve essere pari alle ore. Se menziona spostamenti, aggiungi un prodotto "Trasferta" con prezzo coerente.

- Se l’utente menziona ore lavorative, la quantità va calcolata in ore.
- Se viene indicato un indirizzo, città o via, inserirli nel cliente.
- Se non viene indicata la P.IVA o il CAP, usare placeholder realistici (es. "12345678901", "00183", "Roma").


📬 Inserisci anche indirizzo, CAP e città del cliente se sono presenti nella richiesta (se mancano, scrivi valori placeholder).

‼️ Il JSON deve essere **completo, corretto e senza testo aggiuntivo**.

---

Richiesta utente:
"${richiestaUtente}"
`.trim();
}
