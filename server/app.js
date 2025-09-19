// Importo librerie principali
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importo la funzione principale per generare la fattura
import { generaFattura } from './routes/fattura.js';

// Carico le variabili d'ambiente da .env
dotenv.config();

// Mostro (in sviluppo) se la chiave API è presente
if (process.env.NODE_ENV !== 'production') {
    console.log(
        '🔑 Gemini API Key caricata?',
        process.env.GEMINI_API_KEY ? '✅ Sì' : '❌ No'
    );
}

// Creo l'app Express
const app = express();

// Middleware per abilitare CORS e accettare JSON fino a 10MB
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Route di test/healthcheck
app.get('/', (req, res) => {
    res.send('Server attivo! 🚀');
});

// Route principale: genera una fattura da prompt + fornitore
app.post('/genera', generaFattura);

// Gestione errori generica (non lascia crashare l'app)
app.use((err, req, res, next) => {
    const status = err?.status || 500;
    const code = err?.code || 'INTERNAL_ERROR';
    if (process.env.NODE_ENV !== 'production') {
        console.error('ERROR:', err);
    }
    res.status(status).json({ ok: false, error: code });
});


export default app;
