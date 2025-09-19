import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Successo() {
    const navigate = useNavigate();
    const location = useLocation();
    const tipo = location.state?.tipo || "file"; // "pdf" o "xml"

    return (
        <React.Fragment>
            <Helmet>
                <title>Fattura creata con successo - FatturIAmo</title>
                <meta
                    name="description"
                    content="La tua fattura è stata generata e scaricata correttamente. Ora puoi inviarla al cliente o archiviarla."
                />
                <meta
                    name="keywords"
                    content="fattura generata, download fattura, file pdf xml, fattura pronta, invio cliente"
                />
                <meta name="robots" content="noindex, follow" />
                <meta name="author" content="Claudio De Paolis" />

                {/* OpenGraph */}
                <meta property="og:title" content="Fattura creata con successo - FatturIAmo" />
                <meta
                    property="og:description"
                    content="Operazione completata: la tua fattura è pronta! Scaricala, inviala al cliente o crea una nuova."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://fatturiamo.ai/successo" />
                <meta
                    property="og:image"
                    content="https://fatturiamo.ai/og-image-success.png"
                />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Fattura pronta - FatturIAmo" />
                <meta
                    name="twitter:description"
                    content="La tua fattura è stata scaricata con successo. Ora puoi inviarla o archiviarla!"
                />
                <meta
                    name="twitter:image"
                    content="https://fatturiamo.ai/og-image-success.png"
                />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-purple-400 flex items-center justify-center px-6 bg-animated-gradient">
                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Operazione completata con successo 🎉
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Il tuo {tipo.toUpperCase()} è stato scaricato correttamente. <br />
                        Ora puoi inviarlo al cliente o conservarlo nei tuoi archivi.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate("/genera")}
                            className="w-[80%] flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95"
                        >
                            ➕ Crea nuova fattura
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-[80%] flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95"
                        >
                            🏠 Torna alla Home
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
