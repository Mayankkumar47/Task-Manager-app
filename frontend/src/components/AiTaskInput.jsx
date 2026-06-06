import { useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";

const AiTaskInput = ({ onTaskCreated }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleAiParse = async () => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      setError(null);
      
      // Makes a secure call to your new backend route using your verified axios configuration profile
      const res = await axiosInstance.post("/ai/parse", { prompt: input });
      setPreview(res.data);
    } catch (err) {
      setError("AI generation failed. Check your API token connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAiTask = async () => {
    try {
      // Maps the structured response dictionary fields directly to your existing task creation endpoint
      await axiosInstance.post("/tasks/create", preview);
      setPreview(null);
      setInput("");
      if (onTaskCreated) onTaskCreated(); // Refreshes your dashboard task list automatically
    } catch (err) {
      console.error("Failed to commit task item:", err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 p-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <HiSparkles className="text-cyan-400 animate-pulse text-xl" />
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
          Neural Task Engine
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an unstructured sentence... (e.g. Build MERN app layout by tonight high priority #coding)"
          className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-600 text-sm pl-4 pr-32 py-3.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
        />
        <button
          onClick={handleAiParse}
          disabled={loading}
          className="absolute right-2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "AI Generate"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-2 font-mono">{error}</p>}

      {/* Cyberpunk Preview Window Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 p-4 bg-slate-950/90 border border-cyan-500/40 rounded-xl shadow-inner"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Proposed Structural Schema</span>
              <span className={`text-[9px] px-2 py-0.5 font-mono rounded uppercase tracking-wider ${
                preview.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {preview.priority} priority
              </span>
            </div>
            
            <h4 className="text-base font-semibold text-white mb-1">{preview.title}</h4>
            {preview.description && <p className="text-xs text-slate-400 mb-3">{preview.description}</p>}
            
            <div className="flex flex-wrap gap-1.5">
              {preview.tags?.map((tag, i) => (
                <span key={i} className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-md font-mono">
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-900">
              <button onClick={() => setPreview(null)} className="text-xs text-slate-400 hover:text-white px-3 py-1 font-medium transition-colors">
                Cancel
              </button>
              <button onClick={saveAiTask} className="text-xs bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-cyan-500/10">
                Confirm & Add Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiTaskInput;