import React from "react";

export default function CaricamentoLogoFornitore({ innerRef, titolo, paragrafo, testoBottone1, testoBottone2, onLogoChange, proseguiClick, logoUrl, placeholderTxt, size }) {
    return (
        <React.Fragment>
            <section ref={innerRef} className="min-h-[100vh] flex flex-col items-center justify-center px-6">
                {/* titolo fuori dal riquadro */}
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                    {titolo}
                </h2>
                <p className="text-center text-gray-600 mb-8">{paragrafo}</p>

                {/* riquadro: STESSO STILE DELLA SEZIONE 1 */}
                <div className="max-w-3xl w-full">
                    <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-8">
                        <div className="flex flex-col items-center gap-6">
                            {/* Bottone upload */}
                            <label className="cursor-pointer">
                                <span className="px-5 py-3 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition">
                                    {testoBottone1}
                                </span>
                                <input type="file" accept="image/png,image/jpeg" onChange={onLogoChange} className="hidden" />
                            </label>

                            {/* Anteprima logo */}
                            <div className={`${size} rounded-2xl border bg-white shadow-sm flex items-center justify-center overflow-hidden`}>
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                                ) : (
                                    <span className="text-xs text-gray-500">{placeholderTxt}</span>
                                )}
                            </div>

                            {/* Bottone continua */}
                            <button
                                onClick={proseguiClick}
                                className="px-6 py-3 rounded-2xl text-white bg-purple-600 hover:bg-purple-700 transition"
                            >
                                {testoBottone2}
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}