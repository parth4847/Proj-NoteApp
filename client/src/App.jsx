import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateNote from './pages/CreateNote';
import ViewNote from './pages/ViewNote';
import { Hexagon, Lock } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-[#f3f4f6] font-sans selection:bg-fuchsia-500/30">
        {/* Streamlined Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5 px-6 py-4 flex items-center justify-center transition-all">
          <Link to="/" className="flex items-center gap-3 group transition-all">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-fuchsia-500/20 blur-md rounded-full group-hover:bg-fuchsia-500/40 transition-colors duration-500"></div>
              <Hexagon size={28} className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" strokeWidth={1.5} />
              <Lock size={12} className="absolute text-violet-300 group-hover:text-white transition-colors duration-500" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-white/80 group-hover:from-white group-hover:via-white group-hover:to-white transition-all duration-500">
              FRONTIER NOTES
            </span>
          </Link>
        </nav>

        {/* Core Main View Layout Container */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<CreateNote />} />
            <Route path="/note/:id" element={<ViewNote />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}