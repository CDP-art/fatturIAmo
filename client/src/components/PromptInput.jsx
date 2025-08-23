import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import OutputButtons from "./OutputButtons";
import FatturaIA from "./FatturaIA";
import { useNavigate } from "react-router-dom";
//import { generaPrompt } from "../utils/promptBuilder";



export default function PromptInput() {

    const navigate = useNavigate();
    const handleEdit = () => {
        navigate("/modifica", { state: { invoice: output } });
    };


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


            {/* {output && (
                <pre>{JSON.stringify(output, null, 2)}</pre>
            )} */}

            {output && <FatturaIA rawOutput={output} />}

            {showButtons && (
                <OutputButtons
                    onEdit={handleEdit}
                    onReset={handleReset}
                    invoice={output} />
            )}
        </React.Fragment>
    );
}
