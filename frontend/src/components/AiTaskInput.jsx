import { useState, useEffect } from "react";
import axiosInstance from "../utils/axioInstance";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { playClick, playSuccess, playChime, playError } from "../utils/soundEffects";

const AiTaskInput = ({ onTaskCreated }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
        playChime();
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
        playError();
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const handleMicClick = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge!");
      return;
    }
    
    playClick();
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleAiParse = async () => {
    if (!input.trim()) return;
    try {
      playClick();
      setLoading(true);
      setError(null);
      
      const res = await axiosInstance.post("/ai/parse", { prompt: input });
      setPreview(res.data);
      playChime();
    } catch (err) {
      playError();
      setError("AI generation failed. Check your API token connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAiTask = async () => {
    try {
      playClick();
      // Ensure dueDate exists by assigning today + 1 day if not returned by AI
      const taskPayload = {
        ...preview,
        dueDate: preview.dueDate ? new Date(preview.dueDate) : new Date(Date.now() + 86400000).toISOString()
      };
      
      await axiosInstance.post("/tasks/create", taskPayload);
      playSuccess();
      setPreview(null);
      setInput("");
      if (onTaskCreated) onTaskCreated(); // Refreshes dashboard list
    } catch (err) {
      playError();
      console.error("Failed to commit task item:", err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 p-6 glass-panel rounded-2xl shadow-2xl relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HiSparkles className="text-[var(--color-accent)] animate-pulse text-lg" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Neural Task Engine
          </span>
        </div>
        {isListening && (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce delay-75"></span>
            <span className="w-1.5 h-2.5 bg-red-500 rounded-full animate-bounce delay-150"></span>
            <span className="text-[9px] font-mono text-red-400 font-bold uppercase ml-1">Vocalizing...</span>
          </div>
        )}
      </div>

      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your task... (e.g. Code database index by tomorrow medium priority #db)"
            className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-600 text-sm pl-4 pr-12 py-3.5 rounded-xl border border-slate-800 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all"
          />
          <button
            onClick={handleMicClick}
            type="button"
            title="Dictate Task (Speech-to-Text)"
            className={`absolute right-3.5 top-3.5 cursor-pointer transition-colors ${
              isListening ? "text-red-500" : "text-slate-400 hover:text-white"
            }`}
          >
            {isListening ? <FaStop className="text-sm animate-pulse" /> : <FaMicrophone className="text-sm" />}
          </button>
        </div>

        <button
          onClick={handleAiParse}
          disabled={loading || !input.trim()}
          className="px-5 py-3.5 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-[var(--color-accent)] text-[var(--color-accent)] hover:text-white hover:bg-[var(--color-accent)] font-mono text-xs font-bold uppercase rounded-xl transition-all disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-[var(--color-accent)] disabled:cursor-not-allowed shrink-0"
        >
          {loading ? "Parsing..." : "AI Generate"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-2 font-mono">{error}</p>}

      {/* Cyberpunk Preview Window Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="mt-4 p-4 bg-slate-950/90 border border-[var(--color-accent)]/45 rounded-xl shadow-inner relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500">Proposed Structural Schema</span>
              <span className={`text-[9px] px-2 py-0.5 font-mono rounded uppercase tracking-wider font-bold ${
                preview.priority?.toLowerCase() === 'high' 
                  ? 'bg-red-500/15 text-red-400 border border-red-500/25' 
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
              }`}>
                {preview.priority} priority
              </span>
            </div>
            
            <h4 className="text-sm font-semibold text-white mb-1">{preview.title}</h4>
            {preview.description && <p className="text-xs text-slate-400 mb-3">{preview.description}</p>}
            
            <div className="flex flex-wrap gap-1.5">
              {preview.tags?.map((tag, i) => (
                <span key={i} className="text-[9px] bg-slate-900 border border-slate-800/80 text-[var(--color-accent)] px-2 py-0.5 rounded font-mono">
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-900">
              <button 
                onClick={() => { playClick(); setPreview(null); }} 
                className="text-[10px] font-mono uppercase text-slate-500 hover:text-white px-3 py-1 font-bold transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button 
                onClick={saveAiTask} 
                className="text-[10px] bg-[var(--color-accent)] text-slate-950 font-mono font-bold px-4 py-1.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-[var(--color-glow)] cursor-pointer uppercase"
              >
                Commit Task Node
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiTaskInput;