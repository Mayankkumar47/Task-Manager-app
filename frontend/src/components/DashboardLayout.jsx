import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"
import AiChatPilot from "./AiChatPilot"
import { motion, AnimatePresence } from "framer-motion"
import { isSoundEnabled, setSoundEnabled, playClick, playSuccess } from "../utils/soundEffects"
import { toast } from "react-hot-toast"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)

  // System Configurations
  const [soundOn, setSoundOn] = useState(isSoundEnabled())
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState("General")
  const [feedbackMessage, setFeedbackMessage] = useState("")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    playClick()
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    playSuccess()
    toast.success("Feedback submitted successfully! Thank you.")
    setIsFeedbackOpen(false)
    setFeedbackMessage("")
  }

  const toggleSound = () => {
    const newState = !soundOn
    setSoundEnabled(newState)
    setSoundOn(newState)
    if (newState) {
      // Small click feedback
      playClick()
    }
  }

  const handleAiToggle = () => {
    playClick()
    setIsAiOpen(!isAiOpen)
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-page-bg)] text-[var(--color-text-main)] font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* SaaS Ambient Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none z-0 opacity-60"></div>
      
      {/* SaaS Grid Pattern Layer */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none z-0"></div>

      {/* DESKTOP SIDEBAR */}
      {currentUser && (
        <div className="w-64 hidden md:block z-10 shrink-0">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && currentUser && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-64 h-full z-10"
            >
              <SideMenu activeMenu={activeMenu} onNavigate={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN APPARATUS WINDOW */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        
        {/* TOP LEVEL NAVBAR */}
        <Navbar 
          activeMenu={activeMenu} 
          soundOn={soundOn}
          toggleSound={toggleSound}
          onOpenAi={handleAiToggle}
          onOpenMobileMenu={() => { playClick(); setIsMobileMenuOpen(true); }}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenAbout={() => { playClick(); setIsAboutOpen(true); }}
          onOpenFeedback={() => { playClick(); setIsFeedbackOpen(true); }}
        />

        {/* PAGE SCREEN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="p-4 md:p-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* M.I.N.D. AI CO-PILOT DIALOG PANEL */}
      <AiChatPilot isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* ABOUT US MODAL */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-950 border border-slate-900 p-6 rounded-2xl shadow-2xl flex flex-col font-sans max-h-[85vh] overflow-y-auto z-10"
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 text-lg">💡</span>
                  <h3 className="text-base font-bold text-slate-100">About Task Manager</h3>
                </div>
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer text-sm p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <p>
                  <strong>Task Manager</strong> is a full-stack AI-powered chat application designed to simulate real-world conversational systems with secure authentication and persistent user-based chat history.
                </p>

                <div>
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-2 text-indigo-400">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>Secure JWT-based authentication</li>
                    <li>User-specific persistent chat history</li>
                    <li>Real-time AI responses using Groq LLM APIs</li>
                    <li>Thread-based conversation management</li>
                    <li>Responsive UI (desktop & mobile)</li>
                    <li>Light / Dark theme support</li>
                    <li>Password visibility toggle</li>
                    <li>Toast notifications for user actions</li>
                    <li>Keyboard accessibility (Enter, Escape)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-2 text-indigo-400">Tech Stack</h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li><strong>Frontend:</strong> React, Context API, CSS</li>
                    <li><strong>Backend:</strong> Node.js, Express, REST APIs</li>
                    <li><strong>Database:</strong> MongoDB (thread-based storage)</li>
                    <li><strong>AI:</strong> LLM API integration</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-900 text-center text-slate-500 text-[10px] font-mono">
                  Built as a learning-focused project with emphasis on real-world chat application features.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-950 border border-slate-900 p-6 rounded-2xl shadow-2xl flex flex-col font-sans z-10"
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 text-lg">✍️</span>
                  <h3 className="text-base font-bold text-slate-100">Send Feedback</h3>
                </div>
                <button
                  onClick={() => setIsFeedbackOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                    Feedback Category
                  </label>
                  <select 
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
                  >
                    <option value="General">General Feedback</option>
                    <option value="Bug">Report a Bug</option>
                    <option value="Feature">Request a Feature</option>
                    <option value="UX">UI/UX Suggestion</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Tell us what you think or report any issues..."
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 btn-primary rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Submit Feedback
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardLayout