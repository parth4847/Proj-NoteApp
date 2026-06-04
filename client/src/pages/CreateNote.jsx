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
      <div className="max-w-2xl mx-auto bg-[#111827] border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="text-emerald-500 w-16 h-16" />
          <h2 className="text-3xl font-bold text-white">Note Secured</h2>
          <p className="text-slate-400">Your private note has been encrypted and saved.</p>
          
          <div className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg p-6 mt-6 space-y-6">
            {/* Shareable Link Section */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-400">Shareable Link</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/note/${result.urlId}`}
                  className="flex-1 bg-[#1f2937] text-blue-400 border border-slate-700 rounded-md p-3 outline-none"
                />
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition"
                >
                  {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Password Section (Critical UX: Make sure they know it only shows once) */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                Unlock Password <AlertTriangle size={16} className="text-amber-500"/>
              </label>
              <input 
                type="text" 
                readOnly 
                value={result.password}
                className="w-full bg-[#1f2937] text-amber-500 font-mono text-lg tracking-widest border border-slate-700 rounded-md p-3 outline-none"
              />
              <p className="text-xs text-amber-500/80">
                Copy this password now. It will never be shown again.
              </p>
            </div>
          </div>

          <button 
            onClick={() => { setResult(null); setContent(''); setTopic(''); }}
            className="mt-8 text-sm text-slate-400 hover:text-white transition"
          >
            Create another note
          </button>
        </div>
      </div>
    );
  }

  // Default Form View
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create a Private Note</h1>
        <p className="text-slate-400">Write a note, let AI draft it, and secure it with an auto-generated password.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* AI Drafting Section */}
      <div className="bg-[#111827] border border-slate-800 p-6 rounded-xl space-y-4">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Wand2 size={16} className="text-purple-400" />
          Draft with AI
        </label>
        <div className="flex gap-3">
          <input 
            type="text"
            placeholder="e.g., A reminder to pay the electricity bill tomorrow"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 bg-[#1f2937] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
          />
          <button
            type="button"
            onClick={handleDraftWithAI}
            disabled={loadingAI || !topic.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 rounded-lg font-medium transition flex items-center gap-2"
          >
            {loadingAI ? <Loader2 size={18} className="animate-spin" /> : 'Draft'}
          </button>
        </div>
      </div>

      {/* Core Note Creation Form */}
      <form onSubmit={handleCreateNote} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-slate-300">Note Content</label>
            <span className={`${content.length > 500 ? 'text-red-400' : 'text-slate-500'}`}>
              {content.length} / 500
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your secret note here..."
            className="w-full h-48 bg-[#111827] border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
          />
        </div>

        {/* Note Expiry Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Self-Destruct Timer</label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full bg-[#1f2937] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition"
          >
            <option value="1h">Destroy after 1 Hour</option>
            <option value="24h">Destroy after 24 Hours</option>
            <option value="7d">Destroy after 7 Days</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loadingSubmit || !content.trim() || content.length > 500}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-4 rounded-xl font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          {loadingSubmit ? <Loader2 size={20} className="animate-spin" /> : 'Secure & Generate Link'}
        </button>
      </form>
    </div>
  );
}