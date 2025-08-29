import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Genera una fattura con l’<span className="text-purple-600">IA</span>
                </h1>

                {/* 1) Prompt */}
                <PromptInput onGenerated={handleGenerated} />

                {/* 2) Anteprima (solo dopo la generazione) */}
                {preview && (
                    <>
                        <FatturaIA rawOutput={preview} />
                        <OutputButtons onReset={handleReset} onEdit={handleEdit} />
                    </>
                )}
            </div>
        </div>
    );
}
