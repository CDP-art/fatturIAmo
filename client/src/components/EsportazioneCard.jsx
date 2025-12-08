import { useNavigate } from "react-router-dom";

export default function EsportazioneCard({ descrizioneCard, children }) {
    return (
        <div className="w-full max-w-md mx-auto min-h-[210px] bg-white rounded-2xl shadow-xl ring-1 ring-gray-200/60 p-6 sm:p-8 text-gray-800 flex flex-col justify-around">
            <p className="text-center text-gray-600 mb-8">{descrizioneCard}</p>
            {children}
        </div>
    );
}
