import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { FaRegLightbulb } from 'react-icons/fa';
import PromptInput from '../components/PromptInput';
import FatturaIA from '../components/FatturaIA';
import OutputButtons from '../components/OutputButtons';


export default function Genera() {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);

    const handleGenerated = (normalized) => {
        // opzionale: passo anche nello state
        setPreview(normalized);
    };

    const handleReset = () => {
        setPreview(null);
        localStorage.removeItem("fatturiamo.draft");
    };

    const handleEdit = () => {
        if (preview) {
            navigate("/modifica", { state: { invoice: preview } });
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Genera Fattura con l’IA - FatturIAmo</title>
                <meta
                    name="description"
                    content="Scrivi cosa ti serve in linguaggio naturale. L’IA di FatturIAmo genera automaticamente una fattura pronta da scaricare o modificare."
                />
                <meta
                    name="keywords"
                    content="generatore fatture, fatture con intelligenza artificiale, AI fatture, crea fattura online, FatturIAmo"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Claudio De Paolis" />

                {/* Open Graph */}
                <meta property="og:title" content="Genera Fattura con l’IA - FatturIAmo" />
                <meta
                    property="og:description"
                    content="Scrivi una frase in linguaggio naturale e lascia che l’intelligenza artificiale generi la tua fattura in pochi secondi."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://fatturiamo.ai/genera" />
                <meta property="og:image" content="https://fatturiamo.ai/og-genera.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Genera Fattura con l’IA - FatturIAmo" />
                <meta
                    name="twitter:description"
                    content="Scrivi cosa ti serve, FatturIAmo fa il resto. Genera fatture da prompt testuali usando l’intelligenza artificiale."
                />
                <meta name="twitter:image" content="https://fatturiamo.ai/og-genera.png" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 px-4 py-10">
                <div className="w-full max-w-2xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-lg space-y-6">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Genera una fattura con l’<span className="text-purple-600">IA</span>
                    </h1>
                    <div className="flex items-start gap-3 bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm text-sm text-yellow-800 mb-4">
                        <FaRegLightbulb className="mt-1 text-yellow-500" />
                        <p>
                            <strong>Consiglio:</strong> più dettagli fornisci nel testo (es. quantità, prezzi, descrizioni, date), più precisa sarà la fattura generata.
                        </p>
                    </div>

                    {/* 1) Prompt */}
                    <PromptInput onGenerated={handleGenerated} />

                    {/* 2) Anteprima (solo dopo la generazione) */}
                    {preview && (
                        <>
                            <FatturaIA rawOutput={preview} />
                            <OutputButtons
                                onReset={handleReset}
                                onEdit={handleEdit}
                            />
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}
