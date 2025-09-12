// pages/Demo.jsx
import { useNavigate } from "react-router-dom";
import StepCard from "../components/stepcard.jsx";
import React from "react";

const steps = [
    {
        emoji: "📝",
        title: "Scrivi cosa ti serve",
        description: "Inserisci una frase in linguaggio naturale.",
        example: "«Vorrei una fattura da 160€ per 8 ore giornaliere a 20€ l'ora per Mario Rossi»",
    },
    {
        emoji: "🤖",
        title: "L’AI interpreta la richiesta",
        description: "FatturIAmo analizza il tuo testo e genera una bozza.",
        example: "«Capisce il contesto, le date, il cliente, gli importi…»",
    },
    {
        emoji: "📄",
        title: "Ricevi la tua fattura",
        description: "Ti mostriamo una bozza che puoi scaricare o modificare.",
        example: "«Hai il controllo totale sul risultato finale.»",
    },
];

export default function Demo() {
    const navigate = useNavigate();
    const handleNext = () => navigate("/fornitore");

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 bg-animated-gradient px-4 py-12">
            <section className="min-h-screen flex flex-col items-center justify-center">
                <div className="max-w-6xl mx-auto w-full">
                    {/* Titolo */}
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 text-center mb-16 leading-tight">
                        🚀 Come funziona
                    </h2>

                    {/* Step cards */}
                    <div className="grid gap-10 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <StepCard key={index} {...step} />
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 w-[60%] sm:w-auto mx-auto"
                        >
                            Avanti →
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
