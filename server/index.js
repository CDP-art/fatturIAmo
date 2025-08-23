// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generaFattura } from './routes/fattura.js';

dotenv.config();
console.log("🔑 Gemini API Key caricata?", process.env.GEMINI_API_KEY ? "✅ Sì" : "❌ No");



const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server attivo! 🚀');
});

app.post('/genera', generaFattura);

app.listen(PORT, () => {
    console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
});
