import React from "react";

export default function DatiFornitore({
    innerRef,
    titolo,
    supplier,
    onChange,
    onContinue,
    canContinue,
    onReset,
}) {
    return (
        <section
            ref={innerRef}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
        >
            {/* Titolo */}
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                {titolo}
            </h2>

            {/* Card contenitore */}
            <div className="max-w-3xl w-full">
                <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Ragione sociale */}
                        <div>
                            <label className="block mb-1 text-sm">Ragione sociale *</label>
                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="Es. ACME S.r.l."
                                value={supplier.ragioneSociale}
                                onChange={onChange("ragioneSociale")}
                            />
                        </div>

                        {/* Partita IVA */}
                        <div>
                            <label className="block mb-1 text-sm">Partita IVA</label>
                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="11 cifre"
                                value={supplier.piva}
                                onChange={onChange("piva")}
                            />
                        </div>

                        {/* Email */}
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

                        {/* Telefono */}
                        <div>
                            <label className="block mb-1 text-sm">Telefono</label>
                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="Es. +39 333 1234567"
                                value={supplier.telefono}
                                onChange={onChange("telefono")}
                            />
                        </div>

                        {/* Città */}
                        <div>
                            <label className="block mb-1 text-sm">Città</label>
                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="Roma (RM)"
                                value={supplier.citta}
                                onChange={onChange("citta")}
                            />
                        </div>

                        {/* Indirizzo */}
                        <div>
                            <label className="block mb-1 text-sm">Indirizzo</label>
                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="Via Roma 1"
                                value={supplier.indirizzo}
                                onChange={onChange("indirizzo")}
                            />
                        </div>

                        {/* IBAN suddiviso */}
                        <div className="sm:col-span-2">
                            <label className="block mb-1 text-sm">IBAN</label>
                            <div className="grid grid-cols-6 gap-2">
                                <input
                                    className="border rounded-xl p-3 text-center"
                                    maxLength={2}
                                    placeholder="IT"
                                    value={supplier.ibanCountry || ""}
                                    onChange={onChange("ibanCountry")}
                                />
                                <input
                                    className="border rounded-xl p-3 text-center"
                                    maxLength={2}
                                    placeholder="60"
                                    value={supplier.ibanCheck || ""}
                                    onChange={onChange("ibanCheck")}
                                />
                                <input
                                    className="border rounded-xl p-3 text-center"
                                    maxLength={1}
                                    placeholder="X"
                                    value={supplier.ibanCin || ""}
                                    onChange={onChange("ibanCin")}
                                />
                                <input
                                    className="border rounded-xl p-3 text-center"
                                    maxLength={5}
                                    placeholder="05428"
                                    value={supplier.ibanAbi || ""}
                                    onChange={onChange("ibanAbi")}
                                />
                                <input
                                    className="border rounded-xl p-3 text-center"
                                    maxLength={5}
                                    placeholder="11101"
                                    value={supplier.ibanCab || ""}
                                    onChange={onChange("ibanCab")}
                                />
                                <input
                                    className="border rounded-xl p-3 text-center"
                                    maxLength={12}
                                    placeholder="000000123456"
                                    value={supplier.ibanConto || ""}
                                    onChange={onChange("ibanConto")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottoni */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            type="button"
                            onClick={onReset}
                            className="w-[70%] sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
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
                            className="w-[70%] sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            Salva e continua
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
