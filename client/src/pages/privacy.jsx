import React from "react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="min-h-screen bg-animated-gradient flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8 space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Privacy Policy di FatturIAmo
                    </h1>

                    <section className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            Questa informativa descrive come vengono trattati i dati personali
                            degli utenti che utilizzano l’applicazione{" "}
                            <strong>FatturIAmo</strong>.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            1. Titolare del trattamento
                        </h2>
                        <p>
                            Claudio De Paolis <br />
                            Email: <a href="mailto:dev.claudio94@gmail.com" className="text-blue-600 hover:underline">dev.claudio94@gmail.com</a>
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            2. Tipologie di dati raccolti
                        </h2>
                        <p>
                            Gli utenti possono inserire dati necessari alla generazione di
                            fatture, come:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Dati anagrafici (nome, cognome, indirizzo, P.IVA, CF)</li>
                            <li>Descrizione di beni o servizi</li>
                            <li>Importi e dati fiscali</li>
                        </ul>
                        <p>
                            Non è obbligatorio inserire dati reali durante l’uso
                            dell’applicazione.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            3. Finalità del trattamento
                        </h2>
                        <p>
                            I dati forniti vengono trattati esclusivamente per:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Generare la fattura richiesta dall’utente</li>
                            <li>Mostrare il documento all’interno dell’app</li>
                            <li>Consentire l’esportazione in PDF o XML</li>
                        </ul>
                        <p>I dati non vengono usati per marketing né ceduti a terzi.</p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            4. Modalità del trattamento
                        </h2>
                        <p>
                            I dati inseriti dall’utente vengono elaborati tramite modelli di
                            intelligenza artificiale (<strong>Gemini AI di Google</strong>).
                            Non vengono conservati sui nostri server oltre il tempo necessario
                            alla generazione della fattura. Alcuni servizi terzi trattano dati
                            tecnici (IP, user agent).<br></br>
                            Il trattamento si basa sull’esecuzione del servizio richiesto dall’utente e sul legittimo interesse del titolare alla sicurezza e al miglioramento dell’applicazione.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            5. Servizi di terze parti
                        </h2>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                <strong>Gemini AI (Google)</strong>: generazione automatica delle
                                fatture
                            </li>
                            <li>
                                <strong>Google Analytics</strong>: statistiche anonime e aggregate
                                sul traffico
                            </li>
                            <li>
                                <strong>Google reCAPTCHA</strong>: protezione da accessi
                                automatizzati
                            </li>
                        </ul>

                        I dati possono essere trattati da Google anche al di fuori dell’Unione Europea, nel rispetto delle garanzie previste dal GDPR (es. Clausole Contrattuali Standard).

                        <p>
                            Maggiori dettagli sono disponibili nella{" "}
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

                        <h2 className="text-xl font-semibold text-gray-800">
                            6. Conservazione dei dati
                        </h2>
                        <p>
                            I dati non vengono salvati oltre il tempo necessario alla
                            generazione della fattura; rimangono solo nei documenti esportati
                            dall’utente.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            7. Diritti dell’utente
                        </h2>
                        <p>
                            L’utente può chiedere conferma, rettifica, cancellazione,
                            limitazione del trattamento o opporsi. Può inoltre presentare
                            reclamo al Garante Privacy (<a
                                href="https://www.garanteprivacy.it"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                garanteprivacy.it
                            </a>
                            ).
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800">
                            8. Modifiche
                        </h2>
                        <p>
                            Questa Privacy Policy può essere aggiornata in futuro. Le modifiche
                            saranno pubblicate in questa pagina con data di aggiornamento.
                        </p>
                    </section>
                    {/* Bottone indietro */}
                    <div className="pt-6 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                            ⬅ Torna indietro
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
