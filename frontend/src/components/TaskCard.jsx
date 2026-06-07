import React from "react"
import moment from "moment"
import AvatarGroup from "./AvatarGroup"
import { FaFileLines } from "react-icons/fa6"
import { motion } from "framer-motion"
import Progress from "./Progress"
import { playClick } from "../utils/soundEffects"

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  approvalStatus,
  timeTracked = 0,
  onClick,
}) => {

  const handleCardClick = (e) => {
    playClick()
    if (onClick) {
      onClick(e)
    }
  }

  const getStatusTag = () => {
    if (status === "Completed") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-mono"
    if (status === "In Progress" || status === "InProgress") return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-mono"
    return "bg-amber-500/10 border-amber-500/20 text-amber-400 font-mono"
  }

  const getPriorityTag = () => {
    const p = priority?.toLowerCase()
    if (p === "high") return "bg-rose-500/10 border-rose-500/20 text-rose-400 font-mono"
    if (p === "medium") return "bg-orange-500/10 border-orange-500/20 text-orange-400 font-mono"
    return "bg-slate-900 border-slate-800 text-slate-500 font-mono"
  }

  const getApprovalTag = () => {
    if (!approvalStatus || approvalStatus === "None") return null
    if (approvalStatus === "Approved") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-mono"
    if (approvalStatus === "Rejected") return "bg-rose-500/10 border-rose-500/20 text-rose-400 font-mono"
    return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-mono"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleCardClick}
      className="glass-panel bg-slate-900/40 rounded-2xl p-5 border border-slate-900/60 cursor-pointer space-y-4 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 select-none text-left"
    >

      {/*  Tags */}
      <div className="flex flex-wrap gap-2">
        <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase tracking-wider font-bold ${getStatusTag()}`}>
          {status}
        </span>

        <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase tracking-wider font-bold ${getPriorityTag()}`}>
          {priority}
        </span>

        {getApprovalTag() && (
          <span className={`text-[9px] px-2.5 py-0.5 rounded border uppercase tracking-wider font-bold ${getApprovalTag()}`}>
            {approvalStatus}
          </span>
        )}
      </div>

      {/*  Title & Timer Log */}
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-xs font-bold text-slate-100 line-clamp-2 leading-relaxed tracking-wide font-sans">
          {title}
        </h3>
        {timeTracked > 0 && (
          <span className="text-[10px] font-mono text-slate-500 shrink-0 font-bold" title="Logged Stopwatch Time">
            ⏱️ {timeTracked.toFixed(1)}m
          </span>
        )}
      </div>

      {/*  Description */}
      {description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/*  Progress */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
          <span>SEQUENCE TRACK</span>
          <span className="text-slate-400">{completedTodoCount}/{todoChecklist?.length || 0} items</span>
        </div>
        <Progress progress={progress} status={status} />
      </div>

      {/*  Dates */}
      <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-900/60">
        <span>
          CREATED:{" "}
          <span className="text-slate-400 font-bold">
            {moment(createdAt).format("DD MMM YYYY")}
          </span>
        </span>

        <span>
          DEADLINE:{" "}
          <span className="text-slate-350 font-bold">
            {moment(dueDate).format("DD MMM YYYY")}
          </span>
        </span>
      </div>

      {/*  Footer */}
      <div className="flex items-center justify-between pt-1">
        <AvatarGroup avatars={assignedTo || []} />

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1 text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
            <FaFileLines className="text-indigo-400 text-xs" />
            <span>{attachmentCount}</span>
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default TaskCard