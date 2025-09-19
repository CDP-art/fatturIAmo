import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import IntroFornitore from "../components/IntroFornitore";
import CaricamentoLogoFornitore from "../components/CaricamentoLogoFornitore";
import DatiFornitore from "../components/DatiFornitore";

export default function Fornitore() {
    const navigate = useNavigate();

    // Stato per i dati del fornitore
    const [supplier, setSupplier] = useState(null);

    // Stato per lo step attuale
    //1 = intro
    //2 = logo
    //3 = dati
    const [step, setStep] = useState(1);

    // Dati vuoti di base
    const emptySupplier = {
        ragioneSociale: "",
        piva: "",
        indirizzo: "",
        citta: "",
        email: "",
        telefono: "",
        logoDataUrl: "",
        ibanBlocks: ["", "", "", "", "", "", ""], // array di blocchi
        iban: "", // stringa completa (ricostruita dai blocchi)
    }


    // Carico dal localStorage all’avvio
    useEffect(() => {
        const raw = localStorage.getItem("fatturiamo.supplier");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setSupplier({ ...emptySupplier, ...parsed });
            } catch (error) {
                console.error("Errore nel parsing dei dati:", error);
                setSupplier(emptySupplier);
            }
        } else {
            setSupplier(emptySupplier);
        }
    }, []);

    // Salvataggio semplice
    const saveSupplier = (next) => {

        const ibanCompleto =
            (next.ibanCountry || "") +
            (next.ibanCheck || "") +
            (next.ibanCin || "") +
            (next.ibanAbi || "") +
            (next.ibanCab || "") +
            (next.ibanConto || "");

        const supplierConIban = { ...next, iban: ibanCompleto };

        setSupplier(supplierConIban);
        try {
            localStorage.setItem("fatturiamo.supplier", JSON.stringify(next));
        } catch {
            // Se fallisce il salvataggio non blocco l'app
        }
    };

    // Gestione input testuali
    const onChange = (field) => (e) => {
        saveSupplier({ ...supplier, [field]: e.target.value });
    };

    // Gestione logo
    const onLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isValid = /image\/(png|jpeg)/.test(file.type);
        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Formato non supportato",
                text: "Usa PNG o JPG.",
                customClass: {
                    popup: "rounded-2xl shadow-xl bg-white",
                    title: "text-gray-800 font-bold text-lg",
                    htmlContainer: "text-gray-700 text-sm",
                    confirmButton:
                        "w-[60%] sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 mx-auto",
                },
                buttonsStyling: false,
                confirmButtonText: "Ok, capito",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            saveSupplier({ ...supplier, logoDataUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    // Condizione per poter continuare dallo step 3
    const canContinue = supplier?.ragioneSociale?.trim().length > 0;

    // Funzioni per cambiare step
    const goNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const onIbanChange = (index, value) => {
        const updatedBlocks = [...supplier.ibanBlocks];
        updatedBlocks[index] = value.toUpperCase(); // forza maiuscole
        const fullIban = updatedBlocks.join("");
        saveSupplier({ ...supplier, ibanBlocks: updatedBlocks, iban: fullIban });
    };

    function handleContinue(navigate) {
        Swal.fire({
            title: "Vuoi salvare i dati della tua azienda?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "✅ Continua",
            cancelButtonText: "↩️ Annulla",
            reverseButtons: true, // per mettere "Continua" a destra
            customClass: {
                popup: "rounded-2xl shadow-xl bg-white max-w-lg w-[90%] sm:w-[400px]",
                title: "text-gray-800 font-bold text-lg",
                confirmButton:
                    "bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95",
                cancelButton:
                    "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95",
                actions: "flex justify-between gap-4 mt-6",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // Success alert
                Swal.fire({
                    icon: "success",
                    title: "Dati salvati con successo!",
                    showConfirmButton: false,
                    timer: 1500,
                    /* customClass: {
                        popup: "rounded-2xl shadow-xl bg-white",
                        title: "text-green-600 font-bold text-lg",
                    }, */
                });
                navigate("/genera");
            }
        });
    }



    return (
        <div className="min-h-screen text-gray-800 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-gradient">
            {/* Navigazione step */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/80 shadow">
                    Step {step} di 3
                </span>
            </div>

            {/* STEP 1: Intro */}
            {step === 1 && (
                <IntroFornitore
                    titolo="Ti chiediamo gentilmente di compilare i dati della tua azienda"
                    paragrafo="Queste informazioni verranno usate per intestare e brandizzare le fatture."
                    testoBottone="Inizia"
                    onStartClick={goNext}
                />
            )}

            {/* STEP 2: Logo */}
            {step === 2 && (
                <CaricamentoLogoFornitore
                    titolo="Inserisci il tuo logo"
                    paragrafo="Formati supportati: PNG o JPG."
                    testoBottone1="Carica immagine"
                    testoBottone2="Continua"
                    size="h-28 w-28"
                    logoUrl={supplier?.logoDataUrl}
                    placeholderTxt="Anteprima"
                    onLogoChange={onLogoChange}
                    proseguiClick={goNext}
                    onBackClick={goBack}
                />
            )}


            {/* STEP 3: Dati azienda */}
            {step === 3 && supplier && (
                <DatiFornitore
                    titolo="Dati dell'azienda"
                    supplier={supplier}
                    onChange={onChange}
                    onIbanChange={onIbanChange}
                    canContinue={canContinue}
                    onContinue={() => handleContinue(navigate)}
                    onReset={() => saveSupplier(emptySupplier)}
                    onBack={goBack}   // ⬅️ aggiunto
                />
            )}

            {/* Bottone "Indietro" solo dallo step 2 in poi */}
            {/*  {step > 1 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
                    <button
                        onClick={goBack}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-2xl shadow transition"
                    >
                        ↩️ Indietro
                    </button>
                </div>
            )} */}

            {/* Footer */}
            {/*   <footer className="py-6 text-center text-xs text-gray-500">
                Generato automaticamente da FatturIAmo
            </footer> */}
        </div>
    );
}
