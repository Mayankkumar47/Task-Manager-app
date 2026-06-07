import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import RecentTasks from "../../components/RecentTasks";
import axiosInstance from "../../utils/axioInstance";
import { motion } from "framer-motion";
import { playClick, playError } from "../../utils/soundEffects";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTasks = async () => {
    try {
      // Calls the secure endpoint which filters user-specific allocations automatically
      const response = await axiosInstance.get("/tasks");
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      playError();
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <motion.div 
        className="space-y-6 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Module Title Banner */}
        <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wide text-slate-100 uppercase">
              My Tasks
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
              View and manage tasks assigned to you
            </p>
          </div>
          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono uppercase font-bold">
            {tasks.length} Tasks Active
          </span>
        </div>

        {/* Task Cards Injected Grid Container */}
        <div className="glass-panel bg-slate-900/40 border-slate-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none"></div>
          
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-950 rounded-xl border border-slate-900"></div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono uppercase">
              No tasks assigned to you 📂
            </div>
          ) : (
            <RecentTasks tasks={tasks} />
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MyTasks;