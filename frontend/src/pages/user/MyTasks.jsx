import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import TaskCard from "../../components/TaskCard"
import { motion } from "framer-motion"

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "In Progress", count: 0 },
    { label: "Completed", count: 0 },
  ])

  const [filterStatus, setFilterStatus] = useState("All")

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

      const statusSummary = response.data?.statusSummary || {}

      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/*  HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            My Tasks
          </h2>

          <TaskStatusTabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
          />
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
        ) : allTasks?.length > 0 ? (

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
                    (item) => item.profileImageUrl
                  )}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item._id)}
                />
              </motion.div>
            ))}
          </div>

        ) : (

          /*  EMPTY STATE */
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No tasks found 🚀
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Start by creating your first task
            </p>
          </div>

        )}
      </motion.div>
    </DashboardLayout>
  )
}

export default MyTask