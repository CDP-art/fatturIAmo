import React from "react";

export default function DatiFornitore({
    innerRef,
    titolo,
    supplier,
    onChange,
    onContinue,
    canContinue,
    onReset,
    onBack,
}) {
    console.log("DatiFornitore supplier:", supplier);
    return (
        <section
            ref={innerRef}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
        >
            {/* Titolo */}
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                {titolo}
            </h2>

            {/* Card */}
            <div className="max-w-3xl w-full">
                <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-6">
                    {/* Campi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Ragione sociale */}
                        <div>
                            <label className="block mb-1 text-sm">Ragione sociale</label>
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
                                placeholder="11 cifre, solo numeri"
                                value={supplier.piva}
                                onChange={onChange("piva")}
                                maxLength={11}
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
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9+ ]*" // Permette numeri, + e spazi
                                className="w-full border rounded-xl p-3"
                                placeholder="Es. +39 333 1234567"
                                value={supplier.telefono}
                                onChange={(e) => {
                                    // accetta solo numeri, + e spazi
                                    const cleaned = e.target.value.replace(/[^0-9+ ]/g, "");
                                    onChange("telefono")({ target: { value: cleaned } });
                                }}
                                maxLength={15} // Limite di 15 caratteri
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

                        {/* IBAN input */}
                        <div className="sm:col-span-2">
                            {/* Label for the IBAN input */}
                            <label className="block mb-1 text-sm">IBAN</label>
                            {/* Mobile: single input for full IBAN */}
                            <input
                                type="text"
                                className="w-full border rounded-xl p-3 sm:hidden"
                                placeholder="IT60 0542 8110 1000 0001 2345 6"
                                value={supplier.iban || ""}
                                onChange={onChange("iban")}
                                maxLength={27} // Max length of IBAN
                            />
                            {/* Desktop: split input for IBAN in blocks of 4 characters */}
                            <div className="hidden sm:grid grid-cols-4 md:grid-cols-7 gap-2">
                                {Array(7).fill(0).map((_, index) => {
                                    const ibanBlock = supplier.iban ? supplier.iban.slice(index * 4, index * 4 + 4) : "";
                                    const placeholders = ["IT60", "0542", "8110", "1000", "0001", "2345", "6"];
                                    return (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={4}
                                            className="flex-1 border rounded-xl p-2 text-sm text-center"
                                            placeholder={placeholders[index]}
                                            value={ibanBlock}
                                            onChange={(e) => {
                                                const val = e.target.value.toUpperCase();
                                                let newIban = supplier.iban || "";
                                                if (newIban.length < 28) {
                                                    newIban = newIban.padEnd(28, " ");
                                                }
                                                newIban =
                                                    newIban.substring(0, index * 4) +
                                                    val.padEnd(4, " ").substring(0, 4) +
                                                    newIban.substring(index * 4 + 4);
                                                newIban = newIban.trimEnd();
                                                onChange("iban")({ target: { value: newIban } });
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            {/* This input lets the user enter the full IBAN on mobile, or split blocks on desktop */}
                        </div>
                    </div>

                    {/* Bottoni */}
                    <div className="mt-6 flex flex-col gap-4">
                        {/* Riga principale: indietro e continua */}
                        <div className="flex justify-between gap-4 w-full">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95"
                            >
                                ↩️ Indietro
                            </button>

                            <button
                                onClick={onContinue}
                                disabled={!canContinue}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                Salva e continua
                            </button>
                        </div>

                        {/* Reset separato */}
                        <button
                            type="button"
                            onClick={onReset}
                            className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-2xl shadow transition flex items-center justify-center gap-2"
                        >
                            {/* Icona cestino */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-600"
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

                    </div>
                </div>
            </div>
        </section>
    );
}
