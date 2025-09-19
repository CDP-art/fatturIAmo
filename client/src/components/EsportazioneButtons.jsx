import React from "react";

export default function EsportazioneButtons({ action, testoBottone }) {
    return (
        <React.Fragment>
            <button
                onClick={action}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 
             rounded-2xl border-2 border-purple-200 bg-white 
             hover:border-purple-400 hover:bg-purple-50
             transition shadow-md active:scale-95"
            >
                {/* SVG cloud-download */}

                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
                {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                   
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 20a5 5 0 01.94-9.9A7 7 0 0118 10a5 5 0 011 9.9v.1H7z"
                    />
                    
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12v7m0 0l-3-3m3 3l3-3"
                    />
                </svg> */}

                <span className="text-lg font-semibold text-gray-800">
                    {testoBottone}
                </span>
            </button>

        </React.Fragment>
    )
}