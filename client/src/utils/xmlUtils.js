export function generateInvoiceXML(invoice) {
    const cliente = invoice?.cliente || {};
    const prodotti = invoice?.prodotti || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Fattura>
  <Intestazione>
    <Numero>${invoice?.numeroFattura || invoice?.numero || "N/D"}</Numero>
    <Data>${invoice?.data || invoice?.dataFattura || new Date().toISOString().split("T")[0]}</Data>
  </Intestazione>
  <Cliente>
    <Nome>${cliente?.nome || cliente?.denominazione || ""}</Nome>
    <Indirizzo>${cliente?.indirizzo || ""}</Indirizzo>
    <PIVA>${cliente?.piva || ""}</PIVA>
    <CF>${cliente?.cf || ""}</CF>
    <Email>${cliente?.email || cliente?.pec || ""}</Email>
  </Cliente>
  <DettaglioLinee>
    ${prodotti
            .map(
                (p) => `
      <Riga>
        <Descrizione>${p.descrizione || ""}</Descrizione>
        <Ore>${p.ore || p.quantita || 0}</Ore>
        <Tariffa>${p.tariffa || p.prezzo || 0}</Tariffa>
      </Riga>`
            )
            .join("\n")}
  </DettaglioLinee>
  <Totali>
    <Imponibile>${invoice?.imponibile || 0}</Imponibile>
    <IVA>${invoice?.iva || 0}</IVA>
    <Totale>${invoice?.totale || 0}</Totale>
  </Totali>
</Fattura>`.trim();

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fattura_${invoice?.numero || "senza-numero"}.xml`;
    a.click();
    URL.revokeObjectURL(url);
}
