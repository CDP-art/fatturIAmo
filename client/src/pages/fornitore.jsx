import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Pagina Fornitore a 3 sezioni full-screen (100vh)
// - Sezione 1: Intro + freccia scroll
// - Sezione 2: Upload logo (PNG/JPG, nessun limite lato client)
// - Sezione 3: Dati azienda + anteprima + azioni
// Palette: sfondo sfumato blu→viola, azioni viola/blu, card bianche arrotondate.

export default function Fornitore() {
    const navigate = useNavigate();

    // Stato utente (inserito sempre dall'utente)
    const [supplier, setSupplier] = useState(() => {
        try {
            const raw = localStorage.getItem("fatturiamo.supplier");
            return raw
                ? JSON.parse(raw)
                : {
                    ragioneSociale: "",
                    piva: "",
                    indirizzo: "",
                    email: "",
                    telefono: "",
                    logoDataUrl: "",
                };
        } catch {
            return {
                ragioneSociale: "",
                piva: "",
                indirizzo: "",
                email: "",
                telefono: "",
                logoDataUrl: "",
            };
        }
    });

    // Salvataggio persistente semplice
    const saveSupplier = (next) => {
        setSupplier(next);
        try { localStorage.setItem("fatturiamo.supplier", JSON.stringify(next)); } catch { }
    };

    const onChange = (field) => (e) => {
        saveSupplier({ ...supplier, [field]: e.target.value });
    };

    // Upload logo (solo PNG/JPG, nessun limite di dimensione impostato qui)
    const onLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/image\/(png|jpeg)/.test(file.type)) {
            alert("Formato non supportato. Usa PNG o JPG.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            saveSupplier({ ...supplier, logoDataUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const canContinue = supplier.ragioneSociale.trim().length > 0;

    // Scroll fluido tra le sezioni
    const sec1Ref = useRef(null);
    const sec2Ref = useRef(null);
    const sec3Ref = useRef(null);

    const scrollToRef = (ref) => {
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen text-gray-800 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-gradient">



            {/* Navigazione step (semplice) */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/80 shadow">Step 1 · 2 · 3</span>
            </div>

            {/* SEZIONE 1: Intro */}
            <section ref={sec1Ref} className="min-h-[100vh] flex items-center justify-center px-6">
                <div className="max-w-3xl w-full">
                    <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-semibold">Ti chiediamo gentilmente di compilare i dati della tua azienda</h1>
                        <p className="mt-4 text-gray-600">Queste informazioni verranno usate per intestare e brandizzare le fatture.</p>
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => scrollToRef(sec2Ref)}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white bg-purple-600 hover:bg-purple-700"
                            >
                                Inizia
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M12 4.5a.75.75 0 0 1 .75.75v10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V5.25A.75.75 0 0 1 12 4.5z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE 2: Upload Logo (100vh) */}
            <section ref={sec2Ref} className="min-h-[100vh] flex flex-col items-center justify-center px-6">
                {/* titolo fuori dal riquadro */}
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                    Inserisci il tuo logo
                </h2>
                <p className="text-center text-gray-600 mb-8">Formati supportati: PNG o JPG.</p>

                {/* riquadro: STESSO STILE DELLA SEZIONE 1 */}
                <div className="max-w-3xl w-full">
                    <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-8">
                        <div className="flex flex-col items-center gap-6">
                            {/* Bottone upload */}
                            <label className="cursor-pointer">
                                <span className="px-5 py-3 rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition">
                                    Carica immagine
                                </span>
                                <input type="file" accept="image/png,image/jpeg" onChange={onLogoChange} className="hidden" />
                            </label>

                            {/* Anteprima logo */}
                            <div className="h-28 w-28 rounded-2xl border bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                {supplier.logoDataUrl ? (
                                    <img src={supplier.logoDataUrl} alt="Logo" className="h-full w-full object-contain" />
                                ) : (
                                    <span className="text-xs text-gray-500">Anteprima</span>
                                )}
                            </div>

                            {/* Bottone continua */}
                            <button
                                onClick={() => scrollToRef(sec3Ref)}
                                className="px-6 py-3 rounded-2xl text-white bg-purple-600 hover:bg-purple-700 transition"
                            >
                                Continua
                            </button>
                        </div>

                    </div>
                </div>
            </section>



            {/* SEZIONE 3: Dati azienda (100vh) */}
            <section ref={sec3Ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
                {/* titolo fuori dal riquadro: IDENTICO A SEZIONE 2 */}
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                    Dati dell'azienda
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
                                onClick={() => navigate("/genera")}
                                disabled={!canContinue}
                                className="px-5 py-3 rounded-2xl text-white bg-purple-600 disabled:opacity-40"
                            >
                                Salva e continua
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const empty = { ragioneSociale: "", piva: "", indirizzo: "", email: "", telefono: "", logoDataUrl: "" };
                                    saveSupplier(empty);
                                }}
                                className="px-5 py-3 rounded-2xl border"
                            >
                                Reset campi
                            </button>
                        </div>
                    </div>
                </div>
            </section>




            {/* Footer leggero */}
            <footer className="py-6 text-center text-xs text-gray-500">
                Generato automaticamente da FatturIAmo
            </footer>
        </div>
    );
}
