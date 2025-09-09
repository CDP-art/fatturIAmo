import React from "react";

export default function DatiFornitore({ innerRef, titolo, supplier, onChange, onContinue, canContinue, onReset, }) {
    return (
        <React.Fragment>
            <section ref={innerRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
                {/* titolo fuori dal riquadro: IDENTICO A SEZIONE 2 */}
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                    {titolo}
                </h2>

                {/* riquadro: STESSO STILE/AMPIEZZA DELLA SEZIONE 1/2 */}
                <div className="max-w-3xl w-full">
                    <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-8">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block mb-1 text-sm">Ragione sociale *</label>
                                <input
                                    className="w-full border rounded-xl p-3"
                                    placeholder="Es. ACME S.r.l."
                                    value={supplier.ragioneSociale}
                                    onChange={onChange("ragioneSociale")}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Partita IVA</label>
                                <input
                                    className="w-full border rounded-xl p-3"
                                    placeholder="11 cifre"
                                    value={supplier.piva}
                                    onChange={onChange("piva")}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">IBAN</label>
                                <input
                                    className="w-full border rounded-xl p-3"
                                    placeholder="Es. IT60X0542811101000000123456"
                                    value={supplier.iban}
                                    onChange={onChange("iban")}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-xl p-3"
                                    placeholder="esempio@dominio.it"
                                    value={supplier.email}
                                    onChange={onChange("email")}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Telefono</label>
                                <input
                                    className="w-full border rounded-xl p-3"
                                    placeholder="Es. +39 333 1234567"
                                    value={supplier.telefono}
                                    onChange={onChange("telefono")}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Indirizzo</label>
                                <input
                                    className="w-full border rounded-xl p-3"
                                    placeholder="Via Roma 1, 00100 Roma (RM)"
                                    value={supplier.indirizzo}
                                    onChange={onChange("indirizzo")}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={onReset}
                                className="px-5 py-3 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                                    />
                                </svg>
                                Reset campi
                            </button>

                            <button
                                onClick={onContinue}
                                disabled={!canContinue}
                                className="px-5 py-3 rounded-2xl text-white bg-purple-600 disabled:opacity-40 hover:bg-purple-700 transition"
                            >
                                Salva e continua
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}