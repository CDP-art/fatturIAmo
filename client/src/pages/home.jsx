import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PrivacyModal from "../components/privacyModel";

export default function Home({ privacyChoice, setPrivacyChoice }) {
  const navigate = useNavigate();
  const handleStart = () => navigate("/demo");

  const privacyAccepted = privacyChoice === true;
  const myName = "Claudio De Paolis";

  return (
    <React.Fragment>
      <Helmet>
        <title>FatturIAmo - Genera fatture con l'AI</title>
        <meta
          name="description"
          content="Crea fatture in pochi secondi con l'aiuto dell'intelligenza artificiale. Scrivi cosa ti serve, FatturIAmo fa il resto!"
        />
        <meta
          name="keywords"
          content="fattura, intelligenza artificiale, AI, generatore fatture, partita IVA, FatturIAmo, preventivi, freelance, consulenti"
        />
        <meta name="author" content={myName} />

        {/* OpenGraph per Facebook / LinkedIn */}
        <meta property="og:title" content="FatturIAmo - Genera fatture con l'AI" />
        <meta
          property="og:description"
          content="Scrivi cosa ti serve. FatturIAmo genera la fattura per te in pochi secondi."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fatturiamo.ai/" />
        <meta property="og:image" content="https://fatturiamo.ai/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FatturIAmo - Genera fatture con l'AI" />
        <meta
          name="twitter:description"
          content="Scrivi cosa ti serve. FatturIAmo fa il resto con l'intelligenza artificiale."
        />
        <meta name="twitter:image" content="https://fatturiamo.ai/og-image.png" />
      </Helmet>

      <div className="relative">
        {/* Mostra la PrivacyModal se l’utente non ha ancora scelto */}
        {privacyChoice === null && (
          <PrivacyModal
            onAccept={() => setPrivacyChoice(true)}
            onReject={() => setPrivacyChoice(false)}
          />
        )}

        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-300 via-white to-purple-400 animate-gradient">
          <main className="flex-grow flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                Crea fatture con l’aiuto dell’{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Intelligenza Artificiale
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700">
                Scrivi cosa ti serve.{" "}
                <strong className="text-gray-900">
                  Fattur<span className="text-purple-600">IA</span>mo
                </strong>{" "}
                fa il resto in pochi secondi ✨
              </p>

              <button
                onClick={handleStart}
                disabled={!privacyAccepted}
                className={`font-semibold py-3 px-8 rounded-2xl shadow-lg transition-transform duration-300 w-[70%] sm:w-auto ${privacyAccepted
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                aria-label="Inizia il processo di generazione fattura"
              >
                🚀 Inizia ora
              </button>

              {/* Messaggio se ha rifiutato */}
              {privacyChoice === false && (
                <p className="mt-3 text-sm text-red-600">
                  ⚠️ Bisogna accettare la privacy per poter iniziare.
                </p>
              )}
            </div>
          </main>

          <footer className="py-6 text-center text-sm text-gray-500">
            Designed & developed by{" "}
            <a
              href="https://www.linkedin.com/in/claudiodepaolis/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline font-medium"
            >
              {myName}
            </a>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
}
