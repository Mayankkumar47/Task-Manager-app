import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import { FaFileLines } from "react-icons/fa6"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

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
    navigate("/admin/create-task", { state: { taskId: task._id } })
  }

  const handleDownloadReport = async () => {
    try {
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
    } catch (error) {
      toast.error("Download failed")
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/*  HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Manage Tasks
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition"
            >
              <FaFileLines />
              Download
            </button>
          </div>
        </div>

        {/*  LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
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
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item)}
                />
              </motion.div>
            ))}
          </div>

        ) : (

          /*  EMPTY STATE */
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No tasks available 📂
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Create tasks to start managing work
            </p>
          </div>

        )}

      </motion.div>
    </DashboardLayout>
  )
}

export default ManageTasks