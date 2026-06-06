import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import moment from "moment"
import AvatarGroup from "../../components/AvatarGroup"
import { FaExternalLinkAlt } from "react-icons/fa"
import { motion } from "framer-motion"

const TaskDetails = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50 text-blue-600"
      case "Completed":
        return "bg-green-50 text-green-600"
      default:
        return "bg-purple-50 text-purple-600"
    }
  }

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`)
      setTask(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist]

    if (todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed

      try {
        const response = await axiosInstance.put(`/tasks/${id}/todo`, {
          todoChecklist,
        })
        setTask(response.data?.task)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) link = "https://" + link
    window.open(link, "_blank")
  }

  useEffect(() => {
    getTaskDetailsById()
  }, [id])

  //  LOADING
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <motion.div
        className="p-6 max-w-5xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800">{task?.title}</h2>

          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${getStatusTagColor(
              task?.status
            )}`}
          >
            {task?.status}
          </span>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Description
          </h3>
          <p className="text-gray-700">{task?.description}</p>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard label="Priority" value={task?.priority} />
          <InfoCard
            label="Due Date"
            value={
              task?.dueDate
                ? moment(task?.dueDate).format("Do MMM YYYY")
                : "N/A"
            }
          />
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xs text-gray-500 mb-2">Assigned To</p>
            <AvatarGroup
              avatars={task?.assignedTo?.map((i) => i.profileImageUrl) || []}
            />
          </div>
        </div>

        {/* TODO */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Checklist
          </h3>

          {task?.todoChecklist?.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => updateTodoChecklist(index)}
                className="w-4 h-4"
              />
              <p
                className={`text-sm ${
                  item.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ATTACHMENTS */}
        {task?.attachments?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">
              Attachments
            </h3>

            {task.attachments.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleLinkClick(link)}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <p className="text-sm text-gray-700 truncate">{link}</p>
                <FaExternalLinkAlt className="text-gray-500" />
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </DashboardLayout>
  )
}

export default TaskDetails

const InfoCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800 mt-1">{value}</p>
  </div>
)