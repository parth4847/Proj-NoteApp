import { useState } from 'react';
import { noteAPI } from '../services/api';
import { Wand2, Loader2, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CreateNote() {
  // State management for our form inputs
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [expiresIn, setExpiresIn] = useState('24h');
  // State management for UI feedback (loading, errors, and success results)
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // Will store { urlId, password }
  const [copied, setCopied] = useState(false);

  // @desc Calls our Gemini backend to auto-write a note
  const handleDraftWithAI = async () => {
    if (!topic.trim()) return;
    setLoadingAI(true);
    setError(null);
    try {
      const response = await noteAPI.draftWithAI(topic);
      setContent(response.data.content);
    } catch (err) {
      setError('Failed to draft note with AI. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  // @desc Submits the note to the backend to get a secure URL and Password
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!content.trim() || content.length > 500) return;
    
    setLoadingSubmit(true);
    setError(null);
    try {
      // Send both content and the chosen expiry time
      const response = await noteAPI.create(content, expiresIn); 
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // @desc Helper to copy the generated link to the user's clipboard
  const handleCopyLink = () => {
    const link = `${window.location.origin}/note/${result.urlId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If the note was successfully created, show the Success Screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] transition-all hover:border-white/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
            <CheckCircle2 className="text-emerald-400 w-16 h-16 relative z-10 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Note Secured</h2>
          <p className="text-zinc-400">Your private note has been encrypted and saved.</p>
          
          <div className="w-full bg-black/40 border border-white/5 rounded-xl p-6 mt-6 space-y-6">
            {/* Shareable Link Section */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-zinc-400">Shareable Link</label>
              <div className="flex items-center gap-3 group">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/note/${result.urlId}`}
                  className="flex-1 bg-white/5 text-fuchsia-300 border border-white/10 rounded-lg p-3 outline-none focus:border-fuchsia-500/50 transition-colors cursor-text"
                />
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white p-3 rounded-lg transition-all shadow-lg hover:shadow-fuchsia-500/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Password Section (Critical UX: Make sure they know it only shows once) */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                Unlock Password <AlertTriangle size={16} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"/>
              </label>
              <input 
                type="text" 
                readOnly 
                value={result.password}
                className="w-full bg-amber-500/10 text-amber-400 font-mono text-lg tracking-widest border border-amber-500/20 rounded-lg p-3 outline-none shadow-inner"
              />
              <p className="text-xs text-amber-400/80">
                Copy this password now. It will never be shown again.
              </p>
            </div>
          </div>

          <button 
            onClick={() => { setResult(null); setContent(''); setTopic(''); }}
            className="mt-8 text-sm text-zinc-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
          >
            Create another note
          </button>
        </div>
      </div>
    );
  }

  // Default Form View
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 tracking-tight">Create a Private Note</h1>
        <p className="text-zinc-400">Write a note, let AI draft it, and secure it with an auto-generated password.</p>
      </div>

      {error && (
        <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 shadow-lg">
          <AlertTriangle size={20} className="animate-pulse" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* AI Drafting Section */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 shadow-lg transition-all hover:border-fuchsia-500/30 group">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Wand2 size={16} className="text-fuchsia-400 group-hover:animate-pulse" />
          Draft with AI
        </label>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input 
            type="text"
            placeholder="e.g., A reminder to pay the electricity bill tomorrow"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3.5 text-white placeholder-zinc-500 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 outline-none transition-all shadow-inner"
          />
          <button
            type="button"
            onClick={handleDraftWithAI}
            disabled={loadingAI || !topic.trim()}
            className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-fuchsia-500/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loadingAI ? <Loader2 size={18} className="animate-spin" /> : <><Wand2 size={16} /> Draft</>}
          </button>
        </div>
      </div>

      {/* Core Note Creation Form */}
      <form onSubmit={handleCreateNote} className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6 shadow-lg transition-all hover:border-violet-500/30">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-zinc-300">Note Content</label>
            <span className={`font-mono text-xs ${content.length > 500 ? 'text-red-400' : 'text-zinc-500'}`}>
              {content.length} / 500
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your secret note here..."
            className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all resize-none shadow-inner"
          />
        </div>

        {/* Note Expiry Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Self-Destruct Timer</label>
          <div className="relative">
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="1h">Destroy after 1 Hour</option>
              <option value="24h">Destroy after 24 Hours</option>
              <option value="7d">Destroy after 7 Days</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              ▼
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingSubmit || !content.trim() || content.length > 500}
          className="w-full relative group overflow-hidden bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 p-4 rounded-xl font-bold tracking-wide transition-all hover:border-fuchsia-500/50 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/80 to-violet-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center gap-2 text-white">
            {loadingSubmit ? <Loader2 size={20} className="animate-spin" /> : 'Secure & Generate Link'}
          </span>
        </button>
      </form>
    </div>
  );
}