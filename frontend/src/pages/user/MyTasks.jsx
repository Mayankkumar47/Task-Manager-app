import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import RecentTasks from "../../components/RecentTasks";
import axiosInstance from "../../utils/axioInstance";
import { motion } from "framer-motion";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks/all-user-tasks");
      if (response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Failed to query systemic pipeline inventory:", error);
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
        className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Module Title Banner */}
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-black tracking-wide font-mono text-white uppercase">
            Task Repository Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Querying, tracking, and maintaining standard functional enterprise workflows.
          </p>
        </div>

        {/* Task Cards Injected Grid Container */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-900 rounded-xl border border-slate-800"></div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-mono">
              No relational tasks mapped to this account profile. Initialize your first node sequence.
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