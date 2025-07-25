import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Demo from './pages/demo';
import Genera from './pages/genera';
import ModificaFattura from './pages/modificaFattura';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/genera" element={<Genera />} />
                <Route path="/modifica" element={<ModificaFattura />} />
            </Routes>
        </Router>
    );
}

export default App;
