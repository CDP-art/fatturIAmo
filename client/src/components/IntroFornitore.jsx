import React from "react";

export default function IntroFornitore({ innerRef, onStartClick, titolo, paragrafo, testoBottone }) {
    return (
        <React.Fragment>
            <section ref={innerRef} className="min-h-[100vh] flex items-center justify-center px-6">
                <div className="max-w-3xl w-full">
                    <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">{titolo}</h1>
                        <p className="mt-4 text-gray-600">{paragrafo}</p>
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={onStartClick}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 active:scale-95"
                            >
                                {testoBottone}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M12 4.5a.75.75 0 0 1 .75.75v10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V5.25A.75.75 0 0 1 12 4.5z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}