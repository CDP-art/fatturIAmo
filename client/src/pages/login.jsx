import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-purple-400 flex items-center justify-center px-4">
            <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">
                    Accedi a <span className="text-purple-400">FatturIAmo</span>
                </h2>

                {error && (
                    <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-500 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-500 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Accedi
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                    Non hai un account?{" "}
                    <a
                        href="/signup"
                        className="text-purple-400 hover:underline font-semibold"
                    >
                        Registrati
                    </a>
                </p>

                <div className="mt-6 border-t border-gray-700 pt-4 text-center">
                    <p className="mb-2 text-sm text-gray-500">oppure</p>
                    <button
                        onClick={handleAnonimo}
                        className="w-full border border-purple-500 hover:bg-purple-600 hover:text-white text-purple-400 font-medium py-3 rounded-lg transition"
                    >
                        Continua senza registrazione
                    </button>
                </div>
            </div>
        </div>
    );
}
