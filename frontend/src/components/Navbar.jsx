import React from "react"
import { useSelector } from "react-redux"
import { FaBars, FaVolumeUp, FaVolumeMute, FaRobot } from "react-icons/fa"
import { playClick } from "../utils/soundEffects"

const Navbar = ({ 
  soundOn, 
  toggleSound, 
  onOpenAi, 
  onOpenMobileMenu 
}) => {
  const { currentUser } = useSelector((state) => state.user)

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
        
        {/* Settings buttons (Sound toggle, AI assistant) */}
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

        {/* User profile details badge */}
        {currentUser && (
          <div className="flex items-center gap-2.5 bg-slate-950/45 border border-slate-900 px-3 py-1 rounded-xl">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</p>
              <p className="text-[9px] font-mono text-slate-500 tracking-wider leading-none mt-0.5">{currentUser.role === 'admin' ? 'ADMINISTRATOR' : 'TEAM_MEMBER'}</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-mono font-black text-xs shadow-sm uppercase select-none">
              {currentUser.name ? currentUser.name.charAt(0) : "U"}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar