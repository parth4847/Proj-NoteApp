import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateNote from './pages/CreateNote';
import ViewNote from './pages/ViewNote';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f19] text-[#f3f4f6]">
        {/* Streamlined Navigation Bar */}
        <nav className="border-b border-slate-800 bg-[#0d1321] px-6 py-4 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-blue-400 hover:text-blue-300 transition-colors">
            <ShieldAlert size={24} />
            <span>FRONTIER_NOTES</span>
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