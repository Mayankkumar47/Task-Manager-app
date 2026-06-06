import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { MdDelete } from "react-icons/md"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import SelectedUsers from "../../components/SelectedUsers"
import TodoListInput from "../../components/TodoListInput"
import AddAttachmentsInput from "../../components/AddAttachmentsInput"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import toast from "react-hot-toast"
import Modal from "../../components/Modal"
import DeleteAlert from "../../components/DeleteAlert"
import { motion } from "framer-motion"

const CreateTask = () => {
  const location = useLocation()
  const { taskId } = location.state || {}
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  })

  const [currentTask, setCurrentTask] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }))
  }

  const createTask = async () => {
    setLoading(true)
    try {
      const todolist = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }))

      await axiosInstance.post("/tasks/create", {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      })

      toast.success("Task created successfully!")
      navigate("/admin/tasks")
    } catch (err) {
      toast.error("Error creating task!")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!taskData.title.trim()) return setError("Title required")
    if (!taskData.description.trim()) return setError("Description required")
    if (!taskData.dueDate) return setError("Due date required")

    setError("")
    createTask()
  }

  return (
    <DashboardLayout activeMenu={"Create Task"}>
      <motion.div
        className="p-6 max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {taskId ? "Update Task" : "Create Task"}
          </h2>
        </div>

        {/* FORM CARD */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Task Title
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={taskData.title}
              onChange={(e) => handleValueChange("title", e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={taskData.description}
              onChange={(e) =>
                handleValueChange("description", e.target.value)
              }
            />
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-4">

            <select
              className="p-3 border rounded-xl"
              value={taskData.priority}
              onChange={(e) =>
                handleValueChange("priority", e.target.value)
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <DatePicker
              selected={taskData.dueDate}
              onChange={(date) => handleValueChange("dueDate", date)}
              className="w-full p-3 border rounded-xl"
              placeholderText="Select date"
            />

          </div>

          {/* USERS */}
          <SelectedUsers
            selectedUser={taskData.assignedTo}
            setSelectedUser={(val) =>
              handleValueChange("assignedTo", val)
            }
          />

          {/* TODO */}
          <TodoListInput
            todoList={taskData.todoChecklist}
            setTodoList={(val) =>
              handleValueChange("todoChecklist", val)
            }
          />

          {/* ATTACHMENTS */}
          <AddAttachmentsInput
            attachments={taskData.attachments}
            setAttachments={(val) =>
              handleValueChange("attachments", val)
            }
          />

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Create Task"}
          </motion.button>

        </div>

      </motion.div>
    </DashboardLayout>
  )
}

export default CreateTask