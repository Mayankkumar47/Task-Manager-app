import React from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const RecentTasks = ({ tasks }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/user/task-details/${id}`);
  };
  // Color configuration mapper for quick systemic state scans
  const getStatusStyles = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30",
          text: "text-emerald-400",
          glow: "shadow-emerald-500/5"
        };
      case "InProgress":
      case "In Progress":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/30",
          text: "text-cyan-400",
          glow: "shadow-cyan-500/5"
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          text: "text-amber-400",
          glow: "shadow-amber-500/5"
        };
    }
  };

  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (p === "medium") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-slate-800 text-slate-400 border-slate-700";
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {tasks?.map((task, index) => {
        const stateStyle = getStatusStyles(task.status);
        
        return (
          <motion.div
            key={task._id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4, backgroundColor: "rgba(30, 41, 59, 0.3)" }}
            onClick={() => handleCardClick(task._id)}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg ${stateStyle.glow} transition-all cursor-pointer`}
          >
            {/* Left Side: Title and Core Meta Details */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-100 tracking-wide line-clamp-1">
                  {task.title}
                </h4>
                
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadge(task.priority)}`}>
                  {task.priority || "Medium"}
                </span>
              </div>

              {task.description && (
                <p className="text-xs text-slate-400 line-clamp-1 font-normal max-w-xl">
                  {task.description}
                </p>
              )}

              {/* Tag Badges Array */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {task.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono text-cyan-400/90">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Status Trackers and Timestamps */}
            <div className="flex sm:flex-col items-gether items-start sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-md border ${stateStyle.bg} ${stateStyle.text}`}>
                {task.status}
              </span>
              
              <span className="text-[10px] font-mono text-slate-500">
                {task.dueDate ? moment(task.dueDate).format("MMM DD, YYYY") : moment(task.createdAt).format("MMM DD, YYYY")}
              </span>
            </div>

          </motion.div>
        );
      })}
    </div>
  );
};

export default RecentTasks;