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
import { playClick, playSuccess, playError } from "../../utils/soundEffects"

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

  // Load task details if editing
  const getTaskData = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}`)
      if (response.data) {
        const task = response.data
        setCurrentTask(task)
        setTaskData({
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "Low",
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          assignedTo: task.assignedTo?.map((u) => u._id) || [],
          todoChecklist: task.todoChecklist?.map((item) => item.text) || [],
          attachments: task.attachments || [],
        })
      }
    } catch (err) {
      toast.error("Failed to load task details!")
      console.error(err)
    }
  }

  useEffect(() => {
    if (taskId) {
      getTaskData()
    }
  }, [taskId])

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

      playSuccess()
      toast.success("Task created successfully!")
      navigate("/admin/tasks")
    } catch (err) {
      playError()
      toast.error("Error creating task!")
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async () => {
    setLoading(true)
    try {
      // Preserve completed state for existing subtasks
      const todolist = taskData.todoChecklist.map((strText) => {
        const originalItem = currentTask?.todoChecklist?.find((item) => item.text === strText)
        return {
          text: strText,
          completed: originalItem ? originalItem.completed : false,
        }
      })

      await axiosInstance.put(`/tasks/${taskId}`, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      })

      playSuccess()
      toast.success("Task updated successfully!")
      navigate("/admin/tasks")
    } catch (err) {
      playError()
      toast.error("Error updating task!")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`)
      playSuccess()
      setOpenDeleteAlert(false)
      toast.success("Task deleted successfully!")
      navigate("/admin/tasks")
    } catch (err) {
      playError()
      toast.error("Failed to delete task!")
    }
  }

  const handleSubmit = () => {
    if (!taskData.title.trim()) return setError("Title required")
    if (!taskData.description.trim()) return setError("Description required")
    if (!taskData.dueDate) return setError("Due date required")

    setError("")
    if (taskId) {
      updateTask()
    } else {
      createTask()
    }
  }

  return (
    <DashboardLayout activeMenu={taskId ? "Manage Task" : "Create Task"}>
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
          <h2 className="text-xl font-bold font-mono tracking-wide text-slate-100 uppercase">
            {taskId ? "Update Task" : "Create Task"}
          </h2>
          {taskId && (
            <button
              onClick={() => { playClick(); setOpenDeleteAlert(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 hover:border-red-900/50 text-red-400 font-mono text-[10px] uppercase rounded-xl transition cursor-pointer"
            >
              <MdDelete className="text-xs" />
              Delete Task
            </button>
          )}
        </div>

        {/* FORM CARD */}
        <div className="glass-panel rounded-2xl p-6 space-y-6 relative overflow-hidden text-left bg-slate-900/40 border-slate-800/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none"></div>

          {error && (
            <div className="bg-red-950/30 border border-red-900/35 text-red-400 p-3.5 rounded-xl text-xs font-mono">
              Error: {error}
            </div>
          )}

          {/* TITLE */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter task title..."
              className="w-full p-3.5 bg-slate-950 border border-slate-800 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] text-xs rounded-xl outline-none text-slate-100 placeholder-slate-600 transition-all font-semibold"
              value={taskData.title}
              onChange={(e) => handleValueChange("title", e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter task description and requirements..."
              className="w-full p-3.5 bg-slate-950 border border-slate-800 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] text-xs rounded-xl outline-none text-slate-100 placeholder-slate-600 transition-all leading-relaxed"
              value={taskData.description}
              onChange={(e) =>
                handleValueChange("description", e.target.value)
              }
            />
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Priority level
              </label>
              <select
                className="w-full p-3.5 bg-slate-950 border border-slate-800 focus:border-[var(--color-accent)] text-xs rounded-xl outline-none text-slate-300 font-mono tracking-wider cursor-pointer"
                value={taskData.priority}
                onChange={(e) =>
                  handleValueChange("priority", e.target.value)
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Due Date
              </label>
              <DatePicker
                selected={taskData.dueDate}
                onChange={(date) => handleValueChange("dueDate", date)}
                className="w-full p-3.5 bg-slate-950 border border-slate-800 focus:border-[var(--color-accent)] text-xs rounded-xl outline-none text-slate-300 font-mono tracking-wider cursor-pointer"
                placeholderText="Select deadline date..."
                dateFormat="dd MMM yyyy"
              />
            </div>
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
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer mt-4"
          >
            {loading ? "Saving Task..." : taskId ? "Save Changes" : "Create Task"}
          </motion.button>

        </div>

      </motion.div>

      {/* DELETE CONFIRM ALERT MODAL */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Confirm Node Deprecation"
      >
        <DeleteAlert
          onClose={() => setOpenDeleteAlert(false)}
          onDelete={handleDeleteTask}
        />
      </Modal>
    </DashboardLayout>
  )
}

export default CreateTask