import React from "react";
import { FaFilePdf } from "react-icons/fa";

export default function EsportazioneButtons({ action, testoBottone }) {
    return (<React.Fragment>
        <button
            onClick={action}
            className="w-full flex items-center justify-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 p-4 rounded-xl transition shadow-md active:scale-95"
        >
            <FaFilePdf className="text-2xl text-purple-600" />
            <span className="text-lg font-medium">{testoBottone}</span>
        </button>
    </React.Fragment>)
}