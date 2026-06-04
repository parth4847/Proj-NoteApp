import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { noteAPI } from '../services/api';
import { Lock, Unlock, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

export default function ViewNote() {
  const { id } = useParams(); // Grabs the note ID from the URL
  
  // State for unlocking
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  
  // State for AI Summary
  const [summary, setSummary] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState(null);

  // @desc Calls backend to verify password and return note text
  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await noteAPI.unlock(id, password);
      setNoteContent(response.data.content);
      setIsUnlocked(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlock note');
    } finally {
      setLoading(false);
    }
  };

  // @desc Calls backend to trigger Gemini AI summary
  const handleSummarize = async () => {
    setLoadingSummary(true);
    setError(null);
    try {
      const response = await noteAPI.summarize(id);
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate AI summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // --------------------------------------------------------
  // VIEW 1: The Locked Screen (Asking for Password)
  // --------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] transition-all animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full group-hover:bg-fuchsia-500/30 transition-colors"></div>
            <Lock className="text-violet-400 w-10 h-10 relative z-10 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Encrypted Note</h2>
          <p className="text-sm text-zinc-400">Enter the password to decrypt and view this message.</p>
        </div>

        {error && (
          <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 mb-6 text-sm shadow-lg">
            <AlertTriangle size={18} className="animate-pulse" /> {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center text-white tracking-widest focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all shadow-inner placeholder-zinc-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full relative group overflow-hidden bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 p-4 rounded-xl font-bold tracking-wide transition-all hover:border-violet-500/50 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2 text-white">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Unlock size={18} /> Decrypt Note</>}
            </span>
          </button>
        </form>
      </div>
    );
  }

  // --------------------------------------------------------
  // VIEW 2: The Unlocked Screen (Note Content + AI Features)
  // --------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* The Decrypted Note */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)] transition-all">
        <div className="bg-emerald-500/10 border-b border-white/5 p-4 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <Unlock className="text-emerald-400 animate-pulse" size={20} />
          <span className="text-emerald-400 font-bold tracking-wide">Note Decrypted Successfully</span>
        </div>
        <div className="p-8 text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
          {noteContent}
        </div>
      </div>

      {error && (
        <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 shadow-lg">
          <AlertTriangle size={20} className="animate-pulse" /> {error}
        </div>
      )}

      {/* AI Summary Section */}
      {!summary ? (
        <button
          onClick={handleSummarize}
          disabled={loadingSummary}
          className="w-full backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-500/50 text-fuchsia-300 p-4 rounded-2xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.2)] hover:-translate-y-0.5 active:translate-y-0"
        >
          {loadingSummary ? (
             <Loader2 size={20} className="animate-spin" />
          ) : (
             <><Sparkles size={20} className="group-hover:animate-pulse text-fuchsia-400" /> Summarize this note with AI</>
          )}
        </button>
      ) : (
        <div className="relative backdrop-blur-xl bg-black/40 border border-fuchsia-500/30 rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(217,70,239,0.2)] animate-in zoom-in duration-500">
          <div className="absolute top-0 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-fuchsia-500/20 p-2 rounded-lg">
              <Sparkles className="text-fuchsia-400" size={20} />
            </div>
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 font-extrabold text-xl tracking-wide">AI Summary</h3>
          </div>
          <div className="text-zinc-300 space-y-2 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}