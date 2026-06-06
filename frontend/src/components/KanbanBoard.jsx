import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../utils/axioInstance";
import { motion } from "framer-motion";

const COLUMNS = [
  { id: "Pending", title: "⚡ Pending", bgColor: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  { id: "InProgress", title: "🚀 In Progress", bgColor: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { id: "Completed", title: "✅ Completed", bgColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" }
];

const KanbanBoard = ({ tasks, onTaskMoved }) => {
  // Group your tasks locally into columns based on their status enum matching your MongoDB values
  const columnsData = {
    Pending: tasks?.filter(t => t.status === "Pending") || [],
    InProgress: tasks?.filter(t => t.status === "InProgress" || t.status === "In Progress") || [],
    Completed: tasks?.filter(t => t.status === "Completed") || []
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column or dropped in the exact same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId;

    try {
      // Optimistically trigger a reload on the parent UI layout
      onTaskMoved(draggableId, newStatus);

      // Make a backend request to update the task status in MongoDB
      // Ensure this matches your existing backend edit route endpoint (e.g., /tasks/update/:id or similar)
      await axiosInstance.put(`/tasks/update/${draggableId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to sync drag status to database:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className={`flex flex-col p-4 rounded-2xl border ${col.bgColor} bg-slate-900/20 backdrop-blur-md min-h-[450px]`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/60">
              <h3 className="font-semibold text-sm tracking-wide">{col.title}</h3>
              <span className="text-xs bg-slate-950/60 px-2.5 py-0.5 rounded-full font-mono border border-slate-800">
                {columnsData[col.id].length}
              </span>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 space-y-3 transition-colors rounded-xl p-1 ${
                    snapshot.isDraggingOver ? "bg-slate-950/30" : ""
                  }`}
                >
                  {columnsData[col.id].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                          className={`p-4 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl shadow-xl transition-all select-none ${
                            snapshot.isDragging ? "border-cyan-500 shadow-cyan-500/10 scale-[1.02]" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="font-medium text-sm text-slate-100 line-clamp-2">{task.title}</h4>
                            <span className={`text-[9px] px-1.5 py-0.5 font-mono uppercase rounded border ${
                              task.priority === 'High' || task.priority === 'high'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                          )}

                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags?.map((tag, i) => (
                              <span key={i} className="text-[10px] text-cyan-400 font-mono">
                                #{tag.toLowerCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;