import React from "react";
import { useState } from "react";

export default function PromptInput() {

    const [prompt, setPrompt] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) {
            alert("Per favore, inserisci una richiesta valida.");
            return;
        }
        setIsLoading(true);
        setOutput(""); // Resetta l'output precedente
        // Simula una chiamata API
        setTimeout(() => {
            setOutput(`✅ Ecco la bozza della tua fattura:\n\n${prompt}`);
            setIsLoading(false);
        }, 2000);
    };


    return (
        <React.Fragment>
            <textarea
                placeholder='Es: "Vorrei una fattura di 160€ per la giornata lavorativa" '
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
        </React.Fragment>
    )
}