import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

export default function Accesso() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            navigate("/genera");
        } catch (err) {
            setError("Email o password errati.");
        }
    };

    const handleAnonimo = () => {
        localStorage.setItem("anonimo", "true");
        navigate("/genera");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-100 to-purple-300 bg-animated-gradient flex items-center justify-center px-4">
            <Helmet>
                <title>Accedi a FatturIAmo - Area Riservata</title>
                <meta
                    name="description"
                    content="Accedi a FatturIAmo per generare fatture con l’intelligenza artificiale. Oppure continua senza registrarti."
                />
                <meta
                    name="keywords"
                    content="login, accesso, area riservata, fatture AI, generatore fatture, fatturiamo accesso"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Claudio De Paolis" />

                {/* Open Graph */}
                <meta property="og:title" content="Accedi a FatturIAmo - Area Riservata" />
                <meta
                    property="og:description"
                    content="Entra nel tuo account o continua come ospite per generare fatture con l’intelligenza artificiale."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://fatturiamo.ai/accesso" />
                <meta property="og:image" content="https://fatturiamo.ai/og-accesso.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Accedi a FatturIAmo - Area Riservata" />
                <meta
                    name="twitter:description"
                    content="Accedi o prosegui senza registrazione per creare fatture in modo semplice e veloce con l’IA."
                />
                <meta name="twitter:image" content="https://fatturiamo.ai/og-accesso.png" />
            </Helmet>
            <div className="absolute inset-0 bg-black/20 z-0 flex items-center justify-center">
                <div className="bg-black/90 backdrop-blur-md text-white rounded-2xl shadow-2xl py-10 px-6 sm:px-8 w-full max-w-md border border-purple-500/30 mx-4 my-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Accedi a <span className="text-purple-400">FatturIAmo</span>
                    </h2>

                    {error && (
                        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-purple-500 text-white text-sm sm:text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-purple-500 text-white text-sm sm:text-base"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="w-[70%] mx-auto block bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-semibold py-3 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 active:scale-95"
                        >
                            Accedi
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Non hai un account?{" "}
                        <a
                            href="/signup"
                            className="text-purple-400 hover:underline font-semibold"
                        >
                            Registrati
                        </a>
                    </p>

                    <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                        <p className="mb-3 text-sm text-gray-500">oppure</p>
                        <button
                            onClick={handleAnonimo}
                            className="w-[70%] mx-auto block border border-purple-500/40 text-purple-300 hover:bg-gray-800 hover:border-purple-500 transition rounded-xl py-3 font-medium"
                        >
                            Continua senza registrazione
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}
