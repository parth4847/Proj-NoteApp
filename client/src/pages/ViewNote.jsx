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
      <div className="max-w-md mx-auto mt-12 bg-[#111827] border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="bg-blue-500/10 p-4 rounded-full">
            <Lock className="text-blue-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Encrypted Note</h2>
          <p className="text-sm text-slate-400">Enter the password to decrypt and view this message.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1f2937] border border-slate-700 rounded-lg p-3 text-center text-white tracking-widest focus:border-blue-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Unlock size={18} /> Decrypt Note</>}
          </button>
        </form>
      </div>
    );
  }

  // --------------------------------------------------------
  // VIEW 2: The Unlocked Screen (Note Content + AI Features)
  // --------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* The Decrypted Note */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-emerald-500/10 border-b border-slate-800 p-4 flex items-center gap-3">
          <Unlock className="text-emerald-500" size={20} />
          <span className="text-emerald-500 font-medium tracking-wide">Note Decrypted Successfully</span>
        </div>
        <div className="p-8 text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
          {noteContent}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      {/* AI Summary Section */}
      {!summary ? (
        <button
          onClick={handleSummarize}
          disabled={loadingSummary}
          className="w-full bg-[#1f2937] hover:bg-purple-900/40 border border-slate-700 hover:border-purple-500/50 text-purple-400 p-4 rounded-xl font-medium transition flex items-center justify-center gap-2 group"
        >
          {loadingSummary ? (
             <Loader2 size={20} className="animate-spin" />
          ) : (
             <><Sparkles size={20} className="group-hover:animate-pulse" /> Summarize this note with AI</>
          )}
        </button>
      ) : (
        <div className="bg-gradient-to-br from-[#1a1025] to-[#111827] border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-900/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-400" size={20} />
            <h3 className="text-purple-400 font-bold tracking-wide">AI Summary</h3>
          </div>
          <div className="text-slate-300 space-y-2 text-sm leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}