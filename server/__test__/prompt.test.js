// utils/__test__/prompt.test.js
import request from 'supertest';
import app from '../app.js';

// Test massivo di prompt realistici e variati
const promptCases = [
    {
        prompt: "Fattura da 500 euro IVA inclusa",
        expectedTotale: 500,
        descrizione: "Importo singolo con IVA inclusa"
    },
    {
        prompt: "Consulenza di 5 ore a 80 euro l'ora più IVA",
        expectedTotale: 488,
        descrizione: "Ore e tariffa con IVA"
    },
    {
        prompt: "2 loghi grafici da 300 euro, totale 600 più IVA",
        expectedTotale: 732,
        descrizione: "Servizi multipli con totale espresso"
    },
    {
        prompt: "Progetto da 1.000 euro IVA esclusa",
        expectedTotale: 1220,
        descrizione: "Importo alto con IVA esclusa"
    },
    {
        prompt: "Fattura per 3 consulenze a 100 euro l'una, IVA inclusa",
        expectedTotale: 300,
        descrizione: "Multipli con IVA inclusa"
    },
    {
        prompt: "Servizio di manutenzione per 200 euro + IVA al 10%",
        expectedTotale: 220,
        descrizione: "IVA ridotta al 10%"
    },
    {
        prompt: "Fattura: 10 ore di sviluppo a 45 euro/ora, IVA esclusa",
        expectedTotale: 549,
        descrizione: "Prompt tecnico con ore e IVA esclusa"
    },
    {
        prompt: "Traduzione 5 pagine a 30 euro pagina. Totale 150 euro IVA compresa",
        expectedTotale: 150,
        descrizione: "Totale esplicito IVA inclusa"
    },
    {
        prompt: "2 sessioni di coaching da 90 euro cadauna. Totale: 180 + IVA",
        expectedTotale: 219.6,
        descrizione: "Sessioni multiple con totale esplicito"
    },
    {
        prompt: "Consulenza mensile a forfait 600 euro + IVA",
        expectedTotale: 732,
        descrizione: "Forfait mensile con IVA"
    },
    {
        prompt: "Sito web 1.200 euro IVA inclusa",
        expectedTotale: 1200,
        descrizione: "Sito con importo unico e IVA inclusa"
    },
    {
        prompt: "Fattura per 4 ore a 50 euro + IVA 22%",
        expectedTotale: 244,
        descrizione: "Calcolo manuale classico"
    },
    {
        prompt: "Progetto grafico, costo 700 euro comprensivo di IVA",
        expectedTotale: 700,
        descrizione: "Prompt con sinonimo di inclusiva"
    },
    {
        prompt: "Workshop a 150 euro, IVA 10% inclusa",
        expectedTotale: 150,
        descrizione: "IVA bassa inclusa nel prezzo"
    },
    {
        prompt: "Due articoli a 100 euro cadauno più IVA",
        expectedTotale: 244,
        descrizione: "Articoli multipli con IVA da calcolare"
    },
    {
        prompt: "Consulenza una tantum da 350 euro, IVA esclusa",
        expectedTotale: 427,
        descrizione: "Servizio una tantum"
    },
    {
        prompt: "300 euro per prestazione occasionale, IVA esclusa",
        expectedTotale: 366,
        descrizione: "Prestazione occasionale con IVA"
    },
    {
        prompt: "Logo 120€, IVA inclusa",
        expectedTotale: 120,
        descrizione: "Prezzo singolo espresso con simbolo euro"
    },
    {
        prompt: "500 euro tutto compreso",
        expectedTotale: 500,
        descrizione: "Espressione generica ma comune"
    },
    {
        prompt: "Costo complessivo 1000 euro (inclusa IVA)",
        expectedTotale: 1000,
        descrizione: "IVA compresa, ma detta in modo alternativo"
    }
];

// Test parametrico
describe("✅ Generazione fatture da prompt (massiva)", () => {
    promptCases.forEach(({ prompt, expectedTotale, descrizione }) => {
        it(`→ ${descrizione}`, async () => {
            const res = await request(app)
                .post('/genera')
                .send({
                    prompt,
                    fornitore: {
                        ragioneSociale: "Test SRL",
                        piva: "12345678901"
                    }
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toBeDefined();

            const totale = res.body.data.totale;
            expect(typeof totale).toBe("number");

            const errore = Math.abs(totale - expectedTotale);
            const tolleranza = expectedTotale * 0.05; // 5% di margine

            expect(errore).toBeLessThanOrEqual(tolleranza);
        });
    });
});
