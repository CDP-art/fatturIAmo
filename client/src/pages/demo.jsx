import React from "react";
import { useNavigate } from "react-router-dom";
import StepCard from "../components/stepcard.jsx";
import { Helmet } from "react-helmet";

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
        <React.Fragment>
            <Helmet>
                <title>Come funziona - FatturIAmo</title>
                <meta
                    name="description"
                    content="Scopri come creare fatture in 3 semplici step con FatturIAmo: scrivi cosa ti serve, l'AI interpreta e ti restituisce una bozza pronta."
                />
                <meta
                    name="keywords"
                    content="fatturazione AI, generatore fatture, intelligenza artificiale, creare fatture, freelance, partita IVA"
                />
                <meta name="author" content="Claudio De Paolis" />

                {/* OpenGraph per Facebook/LinkedIn */}
                <meta property="og:title" content="Come funziona - FatturIAmo" />
                <meta
                    property="og:description"
                    content="FatturIAmo ti mostra come creare una fattura in pochi secondi grazie all'intelligenza artificiale."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://fatturiamo.ai/demo" />
                <meta
                    property="og:image"
                    content="https://fatturiamo.ai/og-image-demo.png"
                />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Come funziona - FatturIAmo" />
                <meta
                    name="twitter:description"
                    content="Crea fatture con l'intelligenza artificiale in 3 step. Veloce, semplice, gratuito."
                />
                <meta
                    name="twitter:image"
                    content="https://fatturiamo.ai/og-image-demo.png"
                />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 bg-animated-gradient px-4 py-12">
                <section className="min-h-screen flex flex-col items-center justify-center">
                    <div className="max-w-6xl mx-auto w-full">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 text-center mb-16 leading-tight">
                            🚀 Come funziona
                        </h2>

                        <div className="grid gap-10 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <StepCard key={index} {...step} />
                            ))}
                        </div>

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
        </React.Fragment>
    );
}
