import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaBolt, FaShieldAlt, FaChartBar } from "react-icons/fa"
import { HiSparkles } from "react-icons/hi2"

const FEATURES = [
  { icon: <FaCheckCircle className="text-indigo-400 text-base shrink-0" />, title: "Smart Task Pipelines", desc: "Kanban boards that adapt to your team's workflow" },
  { icon: <FaBolt className="text-indigo-400 text-base shrink-0" />, title: "M.I.N.D. AI Co-Pilot", desc: "Generate & assign tasks instantly using natural language" },
  { icon: <FaChartBar className="text-indigo-400 text-base shrink-0" />, title: "Live Analytics & Reports", desc: "Export CSV reports and track team performance" },
  { icon: <FaShieldAlt className="text-indigo-400 text-base shrink-0" />, title: "Role-Based Access Control", desc: "Admin and Team Member dashboards, fully separated" },
]

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#07090f] text-slate-100 font-sans relative overflow-hidden">

      {/* Background Radial Glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-600/8 blur-[200px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/6 blur-[180px] pointer-events-none z-0" />

      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex w-[48%] relative z-10 flex-col justify-between px-14 py-12 border-r border-white/[0.04] bg-gradient-to-br from-[#0a0c16]/80 to-[#07090f]/60">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <HiSparkles className="text-white text-sm" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">TaskFlow</span>
          <span className="ml-auto text-[9px] font-mono font-bold tracking-widest text-indigo-400 border border-indigo-500/25 bg-indigo-500/8 px-2 py-0.5 rounded-full uppercase">Beta</span>
        </div>

        {/* Main Headline */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              AI-Powered Workspace
            </div>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white">
              Your team's work,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">beautifully organized</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium">
              A unified platform where teams create, track, and complete tasks — powered by AI, built for speed.
            </p>
          </div>

          {/* Feature Tiles */}
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all"
              >
                <div className="mt-0.5">{f.icon}</div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{f.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Quote */}
        <div className="text-[10px] text-slate-600 font-mono">
          © 2025 TaskFlow · Built for modern teams
        </div>
      </div>

      {/* RIGHT PANEL — Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 py-10 z-10 relative">

        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <HiSparkles className="text-white text-xs" />
          </div>
          <span className="text-sm font-bold text-white">TaskFlow</span>
        </div>

        <div className="w-full max-w-sm">
          {children}
        </div>

        {/* Bottom nav link */}
        <p className="mt-6 text-[10px] text-slate-600 font-mono">
          Need help?{" "}
          <a href="mailto:support@taskflow.io" className="text-indigo-400 hover:underline">
            support@taskflow.io
          </a>
        </p>
      </div>
    </div>
  )
}

export default AuthLayout