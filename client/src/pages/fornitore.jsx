import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IntroFornitore from "../components/IntroFornitore";
import CaricamentoLogoFornitore from "../components/CaricamentoLogoFornitore";
import DatiFornitore from "../components/DatiFornitore";

// Pagina Fornitore a 3 sezioni full-screen (100vh)
// - Sezione 1: Intro + freccia scroll
// - Sezione 2: Upload logo (PNG/JPG, nessun limite lato client)
// - Sezione 3: Dati azienda + anteprima + azioni
// Palette: sfondo sfumato blu→viola, azioni viola/blu, card bianche arrotondate.

export default function Fornitore() {
    const navigate = useNavigate();

    // Stato utente (inserito sempre dall'utente)
    const [supplier, setSupplier] = useState(null);

    const emptySupplier = {
        ragioneSociale: "",
        piva: "",
        indirizzo: "",
        email: "",
        telefono: "",
        logoDataUrl: "",
        iban: "",
    }

    useEffect(() => {
        const raw = localStorage.getItem("fatturiamo.supplier");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setSupplier({ ...emptySupplier, ...parsed });
            } catch (error) {
                console.error("Errore nel parsing dei dati del fornitore:", error);
                setSupplier({ emptySupplier }); // fallback
            }
        } else {
            setSupplier({ emptySupplier });
        }
    }, []);


    // Salvataggio persistente semplice
    const saveSupplier = (next) => {
        setSupplier(next);
        try { localStorage.setItem("fatturiamo.supplier", JSON.stringify(next)); } catch { }
    };

    const onChange = (field) => (e) => {
        saveSupplier({ ...supplier, [field]: e.target.value });
    };

    // Caricamento immagine (solo PNG/JPG, nessun limite di dimensione impostato qui)
    /*   const onLogoChange = (e) => {
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
      }; */

    const canContinue = supplier?.ragioneSociale?.trim().length > 0;

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
            <IntroFornitore
                innerRef={sec1Ref}
                onStartClick={() => scrollToRef(sec2Ref)}
                titolo="Ti chiediamo gentilmente di compilare i dati della tua azienda"
                paragrafo="Queste informazioni verranno usate per intestare e brandizzare le fatture."
                testoBottone="Inizia"
            ></IntroFornitore>

            {/* SEZIONE 2: Upload Logo (100vh) */}
            <CaricamentoLogoFornitore
                innerRef={sec2Ref}
                titolo="Inserisci il tuo logo"
                paragrafo="Formati supportati: PNG o JPG."
                testoBottone1="Carica immagine"
                testoBottone2="Continua"
                size="h-28 w-28"
                logoUrl={supplier?.logoDataUrl}
                placeholderTxt="Anteprima"
                proseguiClick={() => scrollToRef(sec3Ref)}
            ></CaricamentoLogoFornitore>




            {/* SEZIONE 3: Dati azienda (100vh) */}
            {supplier && (
                <DatiFornitore
                    innerRef={sec3Ref}
                    titolo="Dati dell'azienda"
                    supplier={supplier}
                    onChange={onChange}
                    onContinue={() => navigate("/genera")}
                    canContinue={canContinue}
                    onReset={() => {
                        const empty = {
                            ragioneSociale: "",
                            piva: "",
                            indirizzo: "",
                            email: "",
                            telefono: "",
                            logoDataUrl: "",
                            iban: ""
                        };
                        saveSupplier(empty);
                    }}
                />
            )}

            {/* Footer leggero */}
            <footer className="py-6 text-center text-xs text-gray-500">
                Generato automaticamente da FatturIAmo
            </footer>
        </div>
    );
}
