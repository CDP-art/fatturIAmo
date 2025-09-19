import React, { useState } from 'react';
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
    );
}
