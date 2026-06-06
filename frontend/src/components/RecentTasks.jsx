import React from "react"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const RecentTasks = ({ tasks = [] }) => {
  const navigate = useNavigate()

  const goToTask = (id) => {
    // adjust route if needed (admin/user)
    navigate(`/admin/task-details/${id}`)
  }

  const statusClass = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700"
    if (status === "Pending") return "bg-yellow-100 text-yellow-700"
    return "bg-blue-100 text-blue-700"
  }

  const priorityClass = (p) => {
    if (p === "High") return "bg-red-100 text-red-700"
    if (p === "Medium") return "bg-orange-100 text-orange-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Tasks
        </h3>

        <button
          onClick={() => navigate("/admin/tasks")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
        >
          See all →
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task, index) => (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => goToTask(task._id)}
                    className="cursor-pointer hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {task.title}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500">
                      {moment(task.createdAt).format("MMM Do, YYYY")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No recent tasks
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default RecentTasks