import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EsportazioneCard from "../components/EsportazioneCard";
import EsportazioneButtons from "../components/EsportazioneButtons";
import { generateInvoicePDF } from "../utils/pdfUtils";
import { generateInvoiceXML } from "../utils/xmlUtils";


function safeGetLS(key, def = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : def;
    } catch {
        return def;
    }
}

export default function EsportaFatturaPDF() {
    const navigate = useNavigate();
    const location = useLocation();

    const invoiceFromState = location.state?.invoice || null;
    const invoiceFromLS = useMemo(() => safeGetLS("fatturiamo.draft", null), []);
    const invoice = invoiceFromState || invoiceFromLS;

    useEffect(() => {
        if (!invoice) navigate("/");
    }, [invoice, navigate]);

    if (!invoice) return null;

    const delay = 2300;

    const handleGeneratePDF = () => {
        try {
            if (!invoice) {
                Swal.fire({
                    icon: "error",
                    title: "Fattura mancante",
                    text: "Nessuna fattura trovata per generare l'XML.",
                });
                return;
            }
            generateInvoicePDF(invoice);
            Swal.fire({
                icon: "success",
                title: "PDF generato!",
                text: "La tua fattura è stata scaricata correttamente.",
                showConfirmButton: false,
                timer: delay,
                customClass: {
                    popup: "rounded-2xl shadow-xl bg-white",
                    title: "text-green-600 font-bold text-lg",
                },
            });

            // Vai alla endpage
            setTimeout(() => {
                navigate("/endpage");
            }, delay);
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Errore durante la generazione del PDF.",
                confirmButtonText: "Ok, capito",
                customClass: {
                    popup: "rounded-2xl shadow-xl bg-white max-w-lg w-[90%] sm:w-[400px]",
                    confirmButton:
                        "bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md",
                },
                buttonsStyling: false,
            });
        }
    };

    const handleGenerateXML = () => {
        try {
            if (!invoice) {
                Swal.fire({
                    icon: "error",
                    title: "Fattura mancante",
                    text: "Nessuna fattura trovata per generare l'XML.",
                });
                return;
            }

            generateInvoiceXML(invoice);

            Swal.fire({
                icon: "success",
                title: "XML generato!",
                text: "La tua fattura è stata scaricata correttamente.",
                showConfirmButton: false,
                timer: delay,
                customClass: {
                    popup: "rounded-2xl shadow-xl bg-white",
                    title: "text-green-600 font-bold text-lg",
                },
            });

            setTimeout(() => {
                navigate("/endpage");
            }, delay);
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Errore durante la generazione dell'XML.",
                confirmButtonText: "Ok, capito",
                customClass: {
                    popup: "rounded-2xl shadow-xl bg-white max-w-lg w-[90%] sm:w-[400px]",
                    confirmButton:
                        "bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-2xl shadow-md",
                },
                buttonsStyling: false,
            });
        }
    };


    return (
        <React.Fragment>
            <Helmet>
                <title>Esporta la tua fattura - FatturIAmo</title>
                <meta
                    name="description"
                    content="Esporta la tua fattura nei formati PDF o XML. Compatibilità garantita con la normativa italiana e stile professionale."
                />
                <meta
                    name="keywords"
                    content="esporta fattura, pdf fattura, xml fattura, fatturazione elettronica, fattura AI, generatore fatture"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Claudio De Paolis" />

                {/* Open Graph (Facebook, WhatsApp, LinkedIn, etc.) */}
                <meta property="og:title" content="Esporta la tua fattura - FatturIAmo" />
                <meta
                    property="og:description"
                    content="Scarica la tua fattura in PDF o XML con un click. Conforme alle regole italiane e pronta all’uso."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://fatturiamo.ai/esporta" />
                <meta property="og:image" content="https://fatturiamo.ai/og-export-fattura.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Esporta la tua fattura - FatturIAmo" />
                <meta
                    name="twitter:description"
                    content="Crea una fattura professionale e scaricala in PDF o XML, pronta per l’invio."
                />
                <meta name="twitter:image" content="https://fatturiamo.ai/og-export-fattura.png" />
            </Helmet>

            <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-300 via-white to-purple-400">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0" />

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-gray-800">
                        🎉 La tua fattura è pronta!
                    </h1>

                    <p className="text-lg text-gray-600 mb-12 text-center max-w-xl">
                        Puoi esportarla nel formato che preferisci. <br />
                        <span className="font-semibold text-purple-600">FatturIAmo</span> ti garantisce compatibilità e stile.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                        <EsportazioneCard descrizioneCard="Crea un PDF formale con tutti i dati di fornitore e cliente.">
                            <EsportazioneButtons
                                action={handleGeneratePDF}
                                testoBottone={
                                    <span className="flex items-center justify-center gap-2">
                                        Esporta in PDF
                                    </span>
                                }
                            />
                        </EsportazioneCard>

                        <EsportazioneCard descrizioneCard="Genera un XML compatibile con la fatturazione elettronica italiana.">
                            <EsportazioneButtons
                                action={handleGenerateXML}
                                testoBottone={
                                    <span className="flex items-center justify-center gap-2">
                                        Esporta in XML
                                    </span>
                                }
                            />
                        </EsportazioneCard>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-12 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-2xl shadow transition"
                    >
                        ⬅️ Torna alla Home
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}
