import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleStart = () => navigate("/demo");
  const myName = "Claudio De Paolis";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-300 via-white to-purple-400 animate-gradient">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-6">
          {/* Titolo emozionale */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Crea fatture con l’aiuto dell’{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Intelligenza Artificiale
            </span>
          </h1>

          {/* Sottotitolo con call psicologica */}
          <p className="text-lg md:text-xl text-gray-700">
            Scrivi cosa ti serve.{" "}
            <strong className="text-gray-900">
              Fattur<span className="text-purple-600">IA</span>mo
            </strong>{" "}
            fa il resto in pochi secondi ✨
          </p>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 w-[70%] sm:w-auto"
          >
            🚀 Inizia ora
          </button>
        </div>
      </main>

      {/* Footer */}
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
  );
}
