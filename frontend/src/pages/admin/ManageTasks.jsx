import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import { FaFileLines } from "react-icons/fa6"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { playClick, playSuccess, playError } from "../../utils/soundEffects"

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const getAllTasks = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      if (response?.data) {
        setAllTasks(response.data.tasks || [])
      }

      const summary = response.data?.statusSummary || {}

      setTabs([
        { label: "All", count: summary.all || 0 },
        { label: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", count: summary.completedTasks || 0 },
      ])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (task) => {
    playClick()
    navigate("/admin/create-task", { state: { taskId: task._id } })
  }

  const handleDownloadReport = async () => {
    try {
      playClick()
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "tasks_details.xlsx")

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
      playSuccess()
      toast.success("Task report downloaded!")
    } catch (error) {
      playError()
      toast.error("Download failed")
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/*  HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-3">
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wide text-slate-100 uppercase">
              All Tasks
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Manage team tasks and deadlines</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-[var(--color-accent)]/30 text-slate-300 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer"
            >
              <FaFileLines className="text-[var(--color-accent)]" />
              Download Report
            </button>
          </div>
        </div>

        {/*  LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl shadow animate-pulse h-44">
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : allTasks.length > 0 ? (

          /*  TASK GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allTasks.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <TaskCard
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map(
                    (i) => i.profileImageUrl
                  )}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item)}
                />
              </motion.div>
            ))}
          </div>

        ) : (

          /*  EMPTY STATE */
          <div className="text-center py-16 border border-dashed border-slate-900 p-8 rounded-2xl">
            <p className="text-slate-500 font-mono text-sm">
              No tasks found in this category 📂
            </p>
            <p className="text-xs text-slate-600 mt-2 font-sans">
              Create new tasks using the task creator
            </p>
          </div>

        )}

      </motion.div>
    </DashboardLayout>
  )
}

export default ManageTasks