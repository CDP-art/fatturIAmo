import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/home";
import Demo from "./pages/demo";
import Genera from "./pages/genera";
import ModificaFattura from "./pages/modificaFattura";
import Accesso from "./pages/login";
import EsportaFattura from "./pages/esportaFattura";
import Fornitore from "./pages/fornitore";
import Successo from "./pages/endPage";
import Privacy from "./pages/privacy";

function App() {
    // null = senza scelta, true = accettata, false = rifiutata
    const [privacyChoice, setPrivacyChoice] = useState(null);
    const privacyAccepted = privacyChoice === true;

    return (
        <Router>
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
                <Route path="/accesso" element={<Accesso />} />
                <Route path="/esporta" element={<EsportaFattura />} />
                <Route path="/fornitore" element={<Fornitore />} />
                <Route path="/endpage" element={<Successo />} />
                <Route path="/privacy" element={<Privacy />} />
            </Routes>
        </Router>
    );
}

export default App;
