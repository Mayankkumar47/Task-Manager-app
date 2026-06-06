import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"
import AiTaskInput from "../../components/AiTaskInput" 
import KanbanBoard from "../../components/KanbanBoard"

const COLORS = ["#38bdf8", "#3b82f6", "#10b981"] // Matching premium neon palette: Cyan, Blue, Emerald

const Dashboard = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState(null)
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const [loading, setLoading] = useState(true)

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    setPieChartData([
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ])

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ])
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/dashboard-data")

      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.error("Error fetching dashboard telemetry data: ", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskMovedLocally = (taskId, newStatus) => {
    setDashboardData((prev) => {
      if (!prev) return prev

      const updatedRecentTasks = prev.recentTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )

      return {
        ...prev,
        recentTasks: updatedRecentTasks,
      }
    })
    getDashboardData() // Re-fetch to synchronize state aggregates
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  // PREMIUM DARK MODE LOADING VIEW
  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-slate-950 min-h-screen p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl shadow-2xl animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-800 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <motion.div
        className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8 selection:bg-cyan-500 selection:text-slate-950"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        
        {/* ⚡ HEADER BLOCK - Futuristic Core Horizon Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 border border-blue-500/20 shadow-2xl shadow-blue-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Welcome back, {currentUser?.name} 👋
            </h2>
            <p className="text-cyan-400/80 font-mono mt-1 text-xs uppercase tracking-wider">
              {moment().format("dddd, Do MMM YYYY")}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-slate-950 px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-white/5 transition"
            onClick={() => navigate("/admin/create-task")}
          >
            + Deploy Node Task
          </motion.button>
        </div>

        {/* 🤖 NEURAL TASK INPUT FIELD ENGINE */}
        <div>
          <AiTaskInput onTaskCreated={getDashboardData} />
        </div>

        {/* 📊 METRICS OVERVIEW - Matte Glass Stat Grid */}
        <div>
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
            System Diagnostics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["Total Tasks", dashboardData?.charts?.taskDistribution?.All, "from-blue-500/20 to-transparent", "border-blue-500/30", "text-blue-400"],
              ["Pending", dashboardData?.charts?.taskDistribution?.Pending, "from-amber-500/20 to-transparent", "border-amber-500/30", "text-amber-400"],
              ["In Progress", dashboardData?.charts?.taskDistribution?.InProgress, "from-cyan-500/20 to-transparent", "border-cyan-500/30", "text-cyan-400"],
              ["Completed", dashboardData?.charts?.taskDistribution?.Completed, "from-emerald-500/20 to-transparent", "border-emerald-500/30", "text-emerald-400"],
            ].map(([title, value, colorGrad, boundaryColor, textTint], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, y: -2 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${colorGrad} bg-slate-900/40 backdrop-blur-md border ${boundaryColor} shadow-xl`}
              >
                <p className={`text-xs font-mono font-medium uppercase tracking-wider ${textTint}`}>{title}</p>
                <h2 className="text-3xl font-black mt-2 text-white font-mono tracking-tight">
                  {value || 0}
                </h2>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 📈 TELEMETRY MATRIX - Neon Visualization Graphs */}
        <div>
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
            Allocation Analytics Telemetry
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-2xl">
              <h4 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">Macro Task Distribution Flow</h4>
              <CustomPieChart data={pieChartData} colors={COLORS} />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-2xl">
              <h4 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">Task Priority Matrix Weights</h4>
              <CustomBarChart data={barChartData} />
            </motion.div>
          </div>
        </div>

        {/* 📋 FLUID KANBAN BOARD ACTIVE TRACKER */}
        <div>
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
            Interactive Drag & Drop Pipeline
          </h3>
          {dashboardData?.recentTasks?.length === 0 ? (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 p-8 rounded-2xl text-center text-slate-500 font-medium text-sm py-12">
              No running sequence tracks found. Initialize an enterprise element inside the engine above. 🚀
            </div>
          ) : (
            <KanbanBoard 
              tasks={dashboardData?.recentTasks} 
              onTaskMoved={handleTaskMovedLocally} 
            />
          )}
        </div>

      </motion.div>
    </DashboardLayout>
  )
}

export default Dashboard