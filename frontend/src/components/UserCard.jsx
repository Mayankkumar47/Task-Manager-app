import React from "react"
import { motion } from "framer-motion"

const UserCard = ({ userInfo }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-panel bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 space-y-4 hover:border-[var(--color-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-glow)] text-left select-none"
    >

      {/*  USER INFO */}
      <div className="flex items-center gap-3">
        <img
          src={userInfo?.profileImageUrl || "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png"}
          alt={userInfo?.name}
          className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 shadow"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
          }}
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">
            {userInfo?.name}
          </p>
          <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
            {userInfo?.email}
          </p>
        </div>
      </div>

      {/*  STATS */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Pending" count={userInfo?.pendingTasks} color="yellow" />
        <StatCard label="Progress" count={userInfo?.inProgressTasks} color="blue" />
        <StatCard label="Done" count={userInfo?.completedTasks} color="green" />
      </div>

    </motion.div>
  )
}

export default UserCard

const StatCard = ({ label, count = 0, color }) => {
  const colorMap = {
    yellow: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
    blue: "bg-[rgba(var(--color-accent-rgb),0.1)] border border-[var(--color-panel-border)]/50 text-[var(--color-accent)]",
    green: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
  }

  return (
    <div className={`flex flex-col items-center justify-center py-2.5 rounded-xl border ${colorMap[color]} font-mono`}>
      <span className="text-xs font-bold">{count}</span>
      <span className="text-[9px] uppercase tracking-wider opacity-80 mt-0.5">{label}</span>
    </div>
  )
}