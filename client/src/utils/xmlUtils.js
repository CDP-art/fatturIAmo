export function generateInvoiceXML(invoice) {
  const cliente = invoice?.cliente || {};
  const prodotti = Array.isArray(invoice?.prodotti) ? invoice.prodotti : [];

  const sdi = (cliente?.sdi || "").trim();
  const pec = (cliente?.pec || "").trim();

  // Regole base Fattura elettronica:
  // - Se SDI presente → CodiceDestinatario = SDI, NO PEC
  // - Se SDI assente → CodiceDestinatario = 0000000 + PECDestinatario
  const codiceDestinatario = sdi ? sdi : "0000000";
  const pecDestinatario = sdi ? "" : pec;

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
    ${cliente?.cf ? `<CF>${cliente.cf}</CF>` : ""}
    <CodiceDestinatario>${codiceDestinatario}</CodiceDestinatario>
    ${pecDestinatario ? `<PECDestinatario>${pecDestinatario}</PECDestinatario>` : ""}
  </Cliente>

  <DettaglioLinee>
    ${prodotti
      .map(
        (p) => `
    <Riga>
      <Descrizione>${p.descrizione || ""}</Descrizione>
      <Quantita>${p.quantita ?? p.ore ?? 0}</Quantita>
      <PrezzoUnitario>${p.prezzo ?? p.tariffa ?? 0}</PrezzoUnitario>
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
  a.download = `Fattura_${invoice?.numeroFattura || invoice?.numero || "senza-numero"}.xml`;
  a.click();
  URL.revokeObjectURL(url);
}
