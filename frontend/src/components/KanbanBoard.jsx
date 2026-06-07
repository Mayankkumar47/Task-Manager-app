import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../utils/axioInstance";
import { motion } from "framer-motion";
import { playClick, playChime, playError } from "../utils/soundEffects";

// Column configurations mapped directly to status enums
const COLUMNS = [
  { id: "Pending", title: "⚡ Pending", colorClass: "text-amber-400", borderClass: "border-slate-900", glowClass: "shadow-sm" },
  { id: "In Progress", title: "🚀 In Progress", colorClass: "text-indigo-400", borderClass: "border-slate-900", glowClass: "shadow-sm" },
  { id: "Completed", title: "✅ Completed", colorClass: "text-emerald-400", borderClass: "border-slate-900", glowClass: "shadow-sm" }
];

const KanbanBoard = ({ tasks, onTaskMoved }) => {
  // Group tasks by status
  const columnsData = {
    "Pending": tasks?.filter(t => t.status === "Pending") || [],
    "In Progress": tasks?.filter(t => t.status === "In Progress" || t.status === "InProgress") || [],
    "Completed": tasks?.filter(t => t.status === "Completed") || []
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId;

    try {
      playClick();
      onTaskMoved(draggableId, newStatus);
      await axiosInstance.put(`/tasks/${draggableId}/status`, { status: newStatus });
      playChime();
    } catch (err) {
      playError();
      console.error("Failed to sync drag status to database:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 select-none">
        {COLUMNS.map((col) => {
          const colTasks = columnsData[col.id] || [];
          return (
            <div 
              key={col.id} 
              className={`flex flex-col p-4 rounded-2xl border ${col.borderClass} bg-slate-950/20 backdrop-blur-md min-h-[450px] shadow-sm`}
            >
              {/* Column Title */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-900/60">
                <h3 className={`font-mono text-xs uppercase tracking-wider font-bold ${col.colorClass}`}>{col.title}</h3>
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-md font-mono">
                  {colTasks.length}
                </span>
              </div>

              {/* Droppable pipeline track */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 transition-colors rounded-xl p-1 ${
                      snapshot.isDraggingOver ? "bg-slate-900/10 border border-dashed border-slate-800/20" : ""
                    }`}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                            className={`p-4 bg-slate-900/40 border rounded-xl shadow-md transition-all relative ${
                              snapshot.isDragging 
                                ? "border-indigo-500/40 shadow-xl shadow-indigo-500/5 scale-[1.02]" 
                                : "border-slate-800/80 hover:border-slate-700/80"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-3 mb-1.5">
                              <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-tight tracking-wide font-sans">{task.title}</h4>
                              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider font-bold shrink-0 ${
                                task.priority?.toLowerCase() === 'high'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : task.priority?.toLowerCase() === 'medium'
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                {task.priority || "Low"}
                              </span>
                            </div>

                            {task.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">{task.description}</p>
                            )}

                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2.5">
                                {task.tags.map((tag, i) => (
                                  <span key={i} className="text-[9px] text-indigo-400 font-mono opacity-80">
                                    #{tag.toLowerCase()}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Time Log & Approval readouts */}
                            {(task.timeTracked > 0 || (task.approvalStatus && task.approvalStatus !== "None")) && (
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-900/40 text-[9px] font-mono text-slate-500">
                                {task.timeTracked > 0 ? (
                                  <span className="font-bold">⏱️ {task.timeTracked.toFixed(1)}m</span>
                                ) : (
                                  <span></span>
                                )}
                                {task.approvalStatus && task.approvalStatus !== "None" && (
                                  <span className={`px-1.5 py-0.5 rounded border uppercase font-bold ${
                                    task.approvalStatus === "Approved" 
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                      : task.approvalStatus === "Rejected"
                                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                  }`}>
                                    {task.approvalStatus}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;