import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Successo() {
    const navigate = useNavigate();
    const location = useLocation();
    const tipo = location.state?.tipo || "file"; // "pdf" o "xml"

    // Redirect automatico dopo 5 secondi (opzionale)
    /* useEffect(() => {
        const timer = setTimeout(() => navigate("/"), 5000);
        return () => clearTimeout(timer);
    }, [navigate]); */

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-purple-400 flex items-center justify-center px-6 bg-animated-gradient">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
                {/* Icona successo */}
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

                {/* Titolo */}
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Operazione completata con successo 🎉
                </h1>

                {/* Messaggio dinamico */}
                <p className="text-gray-600 mb-8">
                    Il tuo {tipo.toUpperCase()} è stato scaricato correttamente. <br />
                    Ora puoi inviarlo al cliente o conservarlo nei tuoi archivi.
                </p>

                {/* Pulsanti */}
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

                {/* Nota */}
                {/*    <p className="text-xs text-gray-400 mt-6 italic">
                    Verrai reindirizzato alla home tra pochi secondi…
                </p> */}
            </div>
        </div>
    );
}
