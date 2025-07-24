import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Demo from './pages/demo';
import Genera from './pages/genera';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/genera" element={<Genera />} />
            </Routes>
        </Router>
    );
}

export default App;
