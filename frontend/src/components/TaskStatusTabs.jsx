import React from "react"
import { motion } from "framer-motion"
import { playClick } from "../utils/soundEffects"

const TaskStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
  const handleTabClick = (label) => {
    playClick()
    setActiveTab(label)
  }

  return (
    <div className="flex flex-wrap gap-2 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <motion.button
            key={tab.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabClick(tab.label)}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition border cursor-pointer font-bold
              ${
                isActive
                  ? "bg-[var(--color-accent)] text-slate-950 border-transparent shadow shadow-[var(--color-glow)]"
                  : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800/80"
              }
            `}
          >
            <span>{tab.label}</span>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-md border font-mono
                ${
                  isActive
                    ? "bg-slate-950/80 text-[var(--color-accent)] border-[var(--color-accent)]/20"
                    : "bg-slate-950 border-slate-900 text-slate-500"
                }
              `}
            >
              {tab.count}
            </span>
          </motion.button>
        );
      })}
    </div>
  )
}

export default TaskStatusTabs