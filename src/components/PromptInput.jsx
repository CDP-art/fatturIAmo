import { useState, useEffect } from "react";
import OutputButtons from "./OutputButtons";

export default function PromptInput() {
    const [prompt, setPrompt] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("Per favore, inserisci una richiesta valida.");
            return;
        }
        setIsLoading(true);
        setOutput(""); // Reset
        setShowButtons(false);

        // Simula chiamata API
        setTimeout(() => {
            setOutput(`✅ Ecco la bozza della tua fattura:\n\n${prompt}`);
            setIsLoading(false);
        }, 2000);
    };

    useEffect(() => {
        if (output && !output.includes("in corso")) {
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
        <>
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
                className={`w-full mt-4 py-3 font-semibold rounded-xl transition text-white ${isLoading
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                    }`}
            >
                {isLoading ? "Generazione in corso..." : "Genera fattura"}
            </button>

            {output && (
                <div className="mt-8 p-4 border border-purple-300 bg-purple-50 rounded-xl text-gray-800 whitespace-pre-line transition-all duration-300">
                    {output}
                </div>
            )}

            {showButtons && (
                <OutputButtons onEdit={handleEdit} onReset={handleReset} />
            )}
        </>
    );
}
