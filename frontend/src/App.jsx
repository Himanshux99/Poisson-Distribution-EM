import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Analysis from './Analysis';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </Router>
  );
}
