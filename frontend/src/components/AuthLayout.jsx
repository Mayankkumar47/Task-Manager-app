import React from "react"
import { motion } from "framer-motion"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden select-none">
      
      {/* Ambient SaaS Radial Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 blur-[180px] pointer-events-none"></div>
      
      {/* Mesh Grid Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none"></div>

      {/* LEFT ASPECT: Interactive Form Stage */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-10 py-10 z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* RIGHT ASPECT: Premium SaaS Feature Panel */}
      <div className="hidden md:flex w-1/2 relative z-10 border-l border-slate-900 bg-slate-950/20 backdrop-blur-sm overflow-hidden flex-col justify-center px-16 text-left select-none">
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          className="space-y-6 max-w-lg relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Active Status Badge */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 relative"></span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
              SECURE WORKSPACE PORTAL
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-white font-sans">
              Taskflow Workspace
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
              Manage tasks, collaborate with your teammates, track time, and secure quality deliverables under one unified SaaS workspace.
            </p>
          </div>

          {/* SaaS features list */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900/60 font-sans text-xs text-slate-350 space-y-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="text-indigo-400 font-bold">✓</span>
              <span>Collaborate on interactive Kanban boards</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-indigo-400 font-bold">✓</span>
              <span>Discuss deliverables in comment threads</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-indigo-400 font-bold">✓</span>
              <span>Track spent hours with the active stopwatch</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-indigo-400 font-bold">✓</span>
              <span>Review work with official task approvals</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}

export default AuthLayout