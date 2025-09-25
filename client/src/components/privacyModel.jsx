import React, { useState } from "react";

export default function PrivacyModal({ onAccept, onReject }) {
    const [visible, setVisible] = useState(true);

    const handleAccept = () => {
        setVisible(false);
        if (onAccept) onAccept();
    };

    const handleReject = () => {
        setVisible(false);
        if (onReject) onReject();
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-[90%] p-6 sm:p-8 space-y-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Informativa sul trattamento dei dati
                </h2>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed max-h-80 overflow-y-auto pr-2">
                    <p>
                        La presente applicazione utilizza i dati inseriti dall’utente
                        esclusivamente ai fini della generazione di documenti fiscali
                        (fatture e preventivi). I dati non vengono archiviati sui nostri
                        server, ma possono essere temporaneamente elaborati attraverso
                        servizi di intelligenza artificiale forniti da{" "}
                        <strong>Google (Gemini AI)</strong>.
                    </p>
                    <p className="mt-3">
                        Al fine di garantire la sicurezza e prevenire attività fraudolente,
                        l’applicazione integra il servizio <strong>Google reCAPTCHA</strong>,
                        che raccoglie dati tecnici (inclusi indirizzo IP e interazioni con
                        l’interfaccia) conformemente alla{" "}
                        <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Privacy Policy di Google
                        </a>
                        .
                    </p>
                    <p className="mt-3">
                        Inoltre, per finalità statistiche e di miglioramento del servizio,
                        utilizziamo <strong>Google Analytics</strong>, che può raccogliere
                        informazioni aggregate e anonime relative al traffico e
                        all’utilizzo dell’applicazione.
                    </p>
                    <p className="mt-3">
                        Per ulteriori dettagli sui trattamenti, sui diritti dell’utente
                        (accesso, rettifica, cancellazione, limitazione) e sulle modalità di
                        esercizio, si invita a consultare la{" "}
                        <a
                            href="/privacy"
                            className="text-blue-600 hover:underline"
                        >
                            Privacy Policy
                        </a> completa.
                    </p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Rifiuta
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:brightness-110 shadow"
                    >
                        Accetta
                    </button>
                </div>
            </div>
        </div>
    );
}
