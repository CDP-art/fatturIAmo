import { useNavigate } from "react-router-dom";

export default function EsportazioneCard({ descrizioneCard, children }) {
    const navigate = useNavigate();

    return (
        <div className="w-full sm:w-[420px] min-h-[360px] bg-white rounded-2xl shadow-xl ring-1 ring-gray-200/60 p-6 sm:p-8 text-gray-800 flex flex-col justify-between">

            <p className="text-center text-gray-600 mb-8">{descrizioneCard}</p>

            {children}

            <div className="mt-8 text-center">
                <button onClick={() => navigate("/")} className="text-sm text-blue-600 hover:underline">
                    Torna alla Home
                </button>
            </div>
        </div>
    );
}
