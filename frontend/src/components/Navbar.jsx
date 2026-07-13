import React, { useState } from "react"
import { useSelector } from "react-redux"
import { FaBars, FaVolumeUp, FaVolumeMute, FaRobot, FaInfoCircle, FaRegCommentDots } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { playClick } from "../utils/soundEffects"

const Navbar = ({ 
  soundOn, 
  toggleSound, 
  onOpenAi, 
  onOpenMobileMenu,
  theme,
  toggleTheme,
  onOpenAbout,
  onOpenFeedback
}) => {
  const { currentUser } = useSelector((state) => state.user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="w-full bg-[#070b13]/40 backdrop-blur-md border-b border-slate-900/60 px-4 md:px-6 py-3.5 flex items-center justify-between z-20 select-none">
      
      {/* LEFT ASPECT: Mobile toggle & Platform Status */}
      <div className="flex items-center gap-3">
        {currentUser && (
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900/40 rounded-lg transition-colors border border-transparent hover:border-slate-800"
          >
            <FaBars className="text-lg" />
          </button>
        )}
        
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold hidden sm:inline">
            ALL SYSTEMS OPERATIONAL
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold sm:hidden">
            ACTIVE
          </span>
        </div>
      </div>

      {/* RIGHT ASPECT: Settings & User Profile */}
      <div className="flex items-center gap-3">
        
        {/* Settings buttons (Sound toggle, AI assistant) - Hidden on home/landing screen */}
        {currentUser && (
          <div className="flex items-center gap-1 bg-slate-950/45 border border-slate-900 p-0.5 rounded-xl">
            {/* M.I.N.D. AI chat drawer button */}
            <button 
              onClick={onOpenAi}
              title="Open M.I.N.D. AI Co-Pilot"
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/40 rounded-lg transition-all border border-transparent hover:border-slate-800/60 cursor-pointer flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold"
            >
              <FaRobot className="text-xs text-indigo-400 animate-bounce" />
              <span className="hidden md:inline tracking-wider">Co-Pilot</span>
            </button>

            {/* Volume control */}
            <button 
              onClick={toggleSound}
              title={soundOn ? "Mute sound feedback" : "Enable sound feedback"}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/40 rounded-lg transition-all border border-transparent hover:border-slate-800/60 cursor-pointer"
            >
              {soundOn ? <FaVolumeUp className="text-xs text-indigo-400" /> : <FaVolumeMute className="text-xs" />}
            </button>
          </div>
        )}

        {/* User profile details badge with Dropdown */}
        {currentUser && (
          <div className="relative">
            <div 
              onClick={() => { playClick(); setIsDropdownOpen(!isDropdownOpen); }}
              className="flex items-center gap-2.5 bg-slate-950/45 border border-slate-900 hover:border-slate-850 px-3 py-1 rounded-xl cursor-pointer select-none transition-all active:scale-[0.98] z-20 relative"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</p>
                <p className="text-[9px] font-mono text-slate-500 tracking-wider leading-none mt-0.5">{currentUser.role === 'admin' ? 'ADMINISTRATOR' : 'TEAM_MEMBER'}</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-mono font-black text-xs shadow-sm uppercase">
                {currentUser.name ? currentUser.name.charAt(0) : "U"}
              </div>
            </div>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Backdrop Overlay Click Catcher */}
                  <div 
                    onClick={() => setIsDropdownOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-slate-950 border border-slate-900 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-20 font-sans"
                  >
                    <div className="px-3.5 py-1.5 border-b border-slate-900/60 mb-1">
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Preferences</p>
                    </div>

                    {/* About Us Menu Option */}
                    <button
                      onClick={() => { setIsDropdownOpen(false); onOpenAbout(); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900/40 text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FaInfoCircle className="text-sm text-indigo-400" />
                      <span>About Task Manager</span>
                    </button>

                    {/* Feedback Menu Option */}
                    <button
                      onClick={() => { setIsDropdownOpen(false); onOpenFeedback(); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900/40 text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FaRegCommentDots className="text-sm text-indigo-400" />
                      <span>Send Feedback</span>
                    </button>

                    {/* Theme Mode Toggle Row */}
                    <div className="px-3 py-2 rounded-xl hover:bg-slate-900/40 flex items-center justify-between transition-colors select-none">
                      <span className="text-xs font-semibold text-slate-400">Theme Mode</span>
                      <button
                        onClick={toggleTheme}
                        type="button"
                        className="w-10 h-5.5 rounded-full bg-slate-900 border border-slate-805 flex items-center p-0.5 cursor-pointer transition-colors relative shrink-0"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[7px] shadow-lg"
                          animate={{ x: theme === 'dark' ? 0 : 18 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          {theme === 'dark' ? "🌙" : "☀️"}
                        </motion.div>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar