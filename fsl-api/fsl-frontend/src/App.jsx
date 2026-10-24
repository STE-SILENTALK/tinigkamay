import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ============================================================================
// PAGE IMPORTS
// 👉 EDIT HERE: If you create a brand new page file inside `src/pages/`,
// import it here first! (Example: import AboutPage from './pages/AboutPage';)
// ============================================================================
import Navbar from './components/Navbar';
import MainMenu from './pages/MainMenu';
import TranslateModule from './pages/TranslateModule';
import AdminDashboard from './pages/AdminDashboard';
import SpeechToHandsign from './pages/SpeechToHandsign';
import About from './pages/About';

// ============================================================================
// MAIN APPLICATION ROUTER (App.jsx)
// This file controls the overall background color of the website and connects
// each URL path (like '/translate' or '/speech') to its matching page file.
// ============================================================================
export default function App() {
  return (
    <Router>
      {/* 👉 EDIT HERE: Main Website Background Color
          Change `bg-[#e8e4db]` (warm beige/stone) to any hex code or Tailwind color
          to change the background color behind all pages! */}
      <div className="min-h-screen bg-[#e8e4db] font-sans flex flex-col pb-12 dark:bg-mist-800">
        
        {/* Top Navigation Bar (Always stays at the top of every page) */}
        <Navbar />

        {/* ================================================================== */}
        {/* WEBSITE URL ROUTES                                                 */}
        {/* 👉 EDIT HERE: To add a new page to the website, add a new <Route>  */}
        {/* line below! Example: <Route path="/about" element={<AboutPage />} /> */}
        {/* ================================================================== */}
        <Routes>
          {/* Home Page / Main Menu (http://localhost:5173/) */}
          <Route path="/" element={<MainMenu />} />

          {/* Admin Data Collection & Training Page (http://localhost:5173/admin) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Camera Handsign-to-Text Page (http://localhost:5173/translate) */}
          <Route path="/translate" element={<TranslateModule />} />

          {/* Microphone Speech-to-Handsign Page (http://localhost:5173/speech) */}
          <Route path="/speech" element={<SpeechToHandsign />} />

          {/* About Page (http://localhost:5173/about) */}
          <Route path="/about" element={<About />} />
        </Routes>

      </div>
    </Router>
  );
}