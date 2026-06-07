import React from "react"
import { motion } from "framer-motion"

const Progress = ({ progress = 0, status }) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
      case "InProgress":
        return "bg-[var(--color-accent)] shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.5)]"
      case "Completed":
        return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
      default:
        return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
    }
  }

  return (
    <div className="w-full h-1.5 bg-slate-950/80 border border-slate-900 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${getColor()} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  )
}

export default Progress