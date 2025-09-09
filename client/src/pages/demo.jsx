// pages/Demo.jsx

import { useNavigate } from "react-router-dom";
import StepCard from "../components/stepcard.jsx";
import React from "react";

const steps = [
    {
        emoji: "📝",
        title: "Scrivi cosa ti serve",
        description: "Inserisci una frase in linguaggio naturale.",
        example: '"Vorrei una fattura da 160€ per le 8 ore giornaliere a 20€ l\'ora per Mario Rossi"',
    },
    {
        emoji: "🤖",
        title: "L’AI interpreta la richiesta",
        description: "FatturIAmo analizza il tuo testo e genera una bozza.",
        example: '"Capisce il contesto, le date, il cliente, gli importi…"'
    },
    {
        emoji: "📄",
        title: "Ricevi la tua fattura",
        description: "Ti mostriamo una bozza che puoi scaricare o modificare.",
        example: '"Hai il controllo totale sul risultato finale."'
    },
];

export default function Demo() {

    // Utilizza useNavigate per la navigazione
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/fornitore");
    };

    return (
        <React.Fragment>
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 bg-animated-gradient px-4 py-8">
                <section className="min-h-screen py-20 bg-white flex flex-col items-center">
                    <div className="max-w-6xl mx-auto px-4 w-full">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-16">
                            Come funziona
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 gap-y-10 mb-16">
                            {steps.map((step, index) => (
                                <StepCard key={index} {...step} />
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleNext}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 active:scale-95"
                            >
                                Prosegui
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    );
}
