import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa"
import { HiSparkles } from "react-icons/hi2"
import axiosInstance from "../utils/axioInstance"
import { playClick, playChime, playError } from "../utils/soundEffects"

const AiChatPilot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Core system consciousness online. I am M.I.N.D., your Task Co-Pilot. Ask me to break down complex tasks, analyze priorities, or draft subtask checklists.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleClose = () => {
    playClick()
    onClose()
  }

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue
    if (!text.trim()) return

    playClick()
    if (!textToSend) {
      setInputValue("")
    }

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }])
    setLoading(true)

    try {
      const res = await axiosInstance.post("/ai/chat", { message: text })
      setMessages((prev) => [...prev, { sender: "ai", text: res.data?.reply }])
      playChime()
    } catch (err) {
      playError()
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "System communication link failure. Please check server bindings or API key setups.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action) => {
    let promptText = ""
    switch (action) {
      case "breakdown":
        promptText = "Create a detailed step-by-step breakdown list for a typical front-end feature implementation task."
        break
      case "prioritize":
        promptText = "How should I structure my workspace priorities for a tight deadline?"
        break
      case "summary":
        promptText = "Analyze my current systemic workloads and suggest efficiency tweaks."
        break
      default:
        return
    }
    handleSend(promptText)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay click catcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
          />

          {/* Sliding Glass Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-slate-950/95 border-l border-slate-900 z-[100] flex flex-col font-sans shadow-2xl"
          >
            {/* Ambient scanner overlay line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent)] opacity-40"></div>
            
            {/* Header Block */}
            <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/30">
              <div className="flex items-center gap-2">
                <FaRobot className="text-[var(--color-accent)] text-lg animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 tracking-wide">M.I.N.D. CO-PILOT</h3>
                  <p className="text-[9px] font-mono text-cyan-400/80 tracking-widest font-bold">SYSTEM_ASSISTANT_V2</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="px-4 py-3 border-b border-slate-900/60 bg-slate-950/40 space-y-1.5 shrink-0 select-none">
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Telemetry Shortcuts</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleQuickAction("breakdown")}
                  className="text-[9px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 px-2 py-1 rounded transition-all cursor-pointer uppercase"
                >
                  Subtasks Gen
                </button>
                <button
                  onClick={() => handleQuickAction("prioritize")}
                  className="text-[9px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 px-2 py-1 rounded transition-all cursor-pointer uppercase"
                >
                  Priority Flow
                </button>
                <button
                  onClick={() => handleQuickAction("summary")}
                  className="text-[9px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 px-2 py-1 rounded transition-all cursor-pointer uppercase"
                >
                  Workload Audit
                </button>
              </div>
            </div>

            {/* Chat Display Box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-950/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed border ${
                      msg.sender === "user"
                        ? "bg-slate-900 border-slate-800 text-slate-100 rounded-tr-none"
                        : "bg-slate-950 border-[var(--color-panel-border)]/50 text-slate-300 rounded-tl-none relative"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-[var(--color-accent)] font-bold">
                        <HiSparkles className="text-[8px] animate-spin" />
                        <span>M.I.N.D. RESPONSE</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-[var(--color-panel-border)]/40 rounded-xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce delay-150"></span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase ml-1">Analyzing...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Console Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md shrink-0 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Direct M.I.N.D. portal query..."
                className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] rounded-xl px-4 py-2.5 text-base md:text-xs outline-none transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="p-2.5 bg-gradient-to-r from-slate-900 to-slate-950 hover:bg-[var(--color-accent)] border border-slate-800 hover:border-[var(--color-accent)] text-[var(--color-accent)] hover:text-white rounded-xl transition-all disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-[var(--color-accent)] disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AiChatPilot
