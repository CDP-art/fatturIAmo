import { useNavigate } from "react-router-dom";

export default function Home() {
  // Utilizza useNavigate per la navigazione
  // Questo hook permette di navigare programmaticamente tra le pagine
  // Ad esempio, per reindirizzare l'utente alla pagina di utilizzo dell'app
  // quando clicca su "Inizia ora"
  // Puoi anche passare parametri o stato se necessario
  const navigate = useNavigate();

  const handleStart = () => {
    // Naviga alla pagina di utilizzo dell'app
    navigate("/demo");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-purple-400 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Crea fatture con l’aiuto dell’
          <span className="text-purple-600 font-semibold">Intelligenza Artificiale</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Scrivi cosa ti serve. <strong className="text-gray-800">
            Fattur<span className="text-purple-600">IA</span>mo
          </strong> fa il resto, in pochi secondi.
        </p>
        <button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition">
          Inizia ora
        </button>
      </div>
    </div>
  );
}
