import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"
import AiChatPilot from "./AiChatPilot"
import { motion, AnimatePresence } from "framer-motion"
import { isSoundEnabled, setSoundEnabled, playClick } from "../utils/soundEffects"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)

  // System Configurations
  const [soundOn, setSoundOn] = useState(isSoundEnabled())
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <div className="min-h-screen flex bg-[#070b13] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
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
    </div>
  )
}

export default DashboardLayout