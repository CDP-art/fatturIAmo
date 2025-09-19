import app from './app.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
});
