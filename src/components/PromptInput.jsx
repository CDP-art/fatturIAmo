import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import OutputButtons from "./OutputButtons";

export default function PromptInput() {
    const [prompt, setPrompt] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    // Funzione asincrona per inviare il prompt al backend
    async function fetchFattura(prompt) {
        try {
            const res = await axios.post('http://localhost:8000/genera',
                { prompt },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setTimeout(() => {
                setOutput(res.data.result);
                setIsLoading(false);
            }, 2000); // Simula un ritardo di 2 secondi
        } catch (error) {
            console.error("Errore durante la generazione della fattura:", error);
            alert("Si è verificato un errore durante la generazione della fattura. Riprova più tardi.");
            setIsLoading(false);
        }
    }

    // Quando si clicca su "Genera"
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("Per favore, inserisci una richiesta valida.");
            return;
        }
        setIsLoading(true);
        setOutput("");
        setShowButtons(false);
        await fetchFattura(prompt);
    };

    useEffect(() => {
        if (output) {
            const delay = setTimeout(() => setShowButtons(true), 1000);
            return () => clearTimeout(delay);
        }
    }, [output]);


    const handleReset = () => {
        setPrompt("");
        setOutput("");
        setShowButtons(false);
    };

    const handleEdit = () => {
        alert("Funzione di modifica avanzata in arrivo!");
    };

    return (
        <React.Fragment>
            <textarea
                placeholder='Es: "Vorrei una fattura di 160€ per la giornata lavorativa"'
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
            />

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full mt-4 py-3 font-semibold rounded-xl transition text-white ${isLoading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                    }`}
            >
                {isLoading ? "Generazione in corso..." : "Genera fattura"}
            </button>


            {output && (
                <pre className="mt-8 p-4 border border-purple-300 bg-purple-50 rounded-xl text-gray-800 whitespace-pre-wrap transition-all duration-300">
                    {JSON.stringify(output, null, 2)}
                </pre>
            )}


            {showButtons && (
                <OutputButtons onEdit={handleEdit} onReset={handleReset} />
            )}
        </React.Fragment>
    );
}
