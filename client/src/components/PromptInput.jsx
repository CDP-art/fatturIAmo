// src/components/PromptInput.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PromptInput() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleGenerate = async () => {
        setErr("");
        if (!text.trim()) {
            setErr("Scrivi cosa vuoi fatturare (es. Crea una fattura da 300€ per soprallugo).");
            return;
        }

        setIsLoading(true);

        try {
            // 1) prendo il fornitore salvato
            const supplier = JSON.parse(localStorage.getItem("fatturiamo.supplier") || "null");

            // 2) chiamo il backend
            const { data } = await axios.post("http://localhost:8000/genera", {
                prompt: text,
                supplier, // opzionale ma consigliato
            });

            // La risposta deve esistere e avere ok === true, altrimenti errore
            if (!data || data.ok !== true) {
                const messaggio = data && data.error
                    ? `Generazione fallita: ${data.error}`
                    : "Generazione fallita: risposta non valida dal server";
                throw new Error(messaggio);
            }


            // 3) salvo il draft normalizzato e vado in modifica
            localStorage.setItem("fatturiamo.draft", JSON.stringify(data.data));
            navigate("/modifica");
        } catch (e) {
            console.error(e);
            setErr("Qualcosa è andato storto nella generazione. Riprova.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <textarea
                className="w-full border-2 border-purple-300 focus:border-purple-500 rounded-xl p-4 min-h-[140px] outline-none"
                placeholder="Esempio: Crea una fattura da 150€ per una consulenza"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-4 py-3 rounded-2xl text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
                {isLoading ? "Generazione fattura in corso..." : "Genera fattura"}
            </button>
        </>
    );
}
