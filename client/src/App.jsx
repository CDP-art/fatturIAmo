import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnalyticsTracker } from "./AnalyticsTracker";

//import { useState } from "react";
const Home = lazy(() => import("./pages/home"));
const Demo = lazy(() => import("./pages/demo"));
const Genera = lazy(() => import("./pages/genera"));
const ModificaFattura = lazy(() => import("./pages/modificaFattura"));
//const Accesso = lazy(() => import("./pages/login"));
const EsportaFattura = lazy(() => import("./pages/esportaFattura"));
const Fornitore = lazy(() => import("./pages/fornitore"));
const Successo = lazy(() => import("./pages/endPage"));
const Privacy = lazy(() => import("./pages/privacy"));


function App() {
    // null = senza scelta, true = accettata, false = rifiutata
    const [privacyChoice, setPrivacyChoice] = useState(null);
    const privacyAccepted = privacyChoice === true;

    return (
        <Router>
            <AnalyticsTracker />
            <Suspense fallback={<div className="text-center mt-10">Caricamento...</div>}>
                <Routes>
                    {/* Home riceve la gestione della privacy come prop */}
                    <Route
                        path="/"
                        element={
                            <Home
                                privacyChoice={privacyChoice}
                                setPrivacyChoice={setPrivacyChoice}
                            />
                        }
                    />

                    <Route path="/demo" element={<Demo />} />

                    {/* Proteggiamo la pagina Genera */}
                    <Route
                        path="/genera"
                        element={
                            privacyAccepted ? (
                                <Genera />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    <Route path="/modifica" element={<ModificaFattura />} />
                    {/* <Route path="/accesso" element={<Accesso />} /> */}
                    <Route path="/esporta" element={<EsportaFattura />} />
                    <Route path="/fornitore" element={<Fornitore />} />
                    <Route path="/endpage" element={<Successo />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
