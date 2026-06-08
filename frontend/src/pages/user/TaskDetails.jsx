import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import moment from "moment"
import AvatarGroup from "../../components/AvatarGroup"
import { FaExternalLinkAlt, FaArrowLeft, FaClock, FaPlay, FaStop, FaComments, FaPaperPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { motion } from "framer-motion"
import { playClick, playSuccess, playChime, playError } from "../../utils/soundEffects"
import toast from "react-hot-toast"

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Live Timer tick
  useEffect(() => {
    let timerInterval
    if (task?.isTimerRunning && task?.timerStartedAt) {
      const updateElapsed = () => {
        const start = new Date(task.timerStartedAt)
        const now = new Date()
        const diffMs = now - start
        setElapsedSeconds(Math.floor(diffMs / 1000))
      }
      updateElapsed()
      timerInterval = setInterval(updateElapsed, 1000)
    } else {
      setElapsedSeconds(0)
    }
    return () => clearInterval(timerInterval)
  }, [task?.isTimerRunning, task?.timerStartedAt])

  const formatElapsed = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
      case "InProgress":
        return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      case "Completed":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      default:
        return "bg-amber-500/10 border-amber-500/20 text-amber-400"
    }
  }

  const getApprovalTagColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      case "Rejected":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400"
      case "Pending Approval":
        return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      default:
        return "bg-slate-900 border-slate-800 text-slate-400"
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
      const isChecking = !todoChecklist[index].completed
      todoChecklist[index].completed = isChecking

      try {
        if (isChecking) {
          playSuccess()
        } else {
          playClick()
        }
        
        const response = await axiosInstance.put(`/tasks/${id}/todo`, {
          todoChecklist,
        })
        setTask(response.data?.task)
      } catch (error) {
        playError()
        console.log(error)
      }
    }
  }

  // Live Timer controls
  const handleStartTimer = async () => {
    try {
      playClick()
      const response = await axiosInstance.post(`/tasks/${id}/timer/start`)
      setTask(response.data?.task)
      toast.success("Timer started!")
    } catch (error) {
      playError()
      toast.error("Failed to start timer")
    }
  }

  const handleStopTimer = async () => {
    try {
      playClick()
      const response = await axiosInstance.post(`/tasks/${id}/timer/stop`)
      setTask(response.data?.task)
      playSuccess()
      toast.success("Timer stopped. Time logged!")
    } catch (error) {
      playError()
      toast.error("Failed to stop timer")
    }
  }

  // Comments submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    playClick()
    const text = commentText.trim()
    setCommentText("")

    try {
      const response = await axiosInstance.post(`/tasks/${id}/comments`, { text })
      setTask(response.data?.task)
      playChime()
    } catch (error) {
      playError()
      toast.error("Failed to post comment")
    }
  }

  // Approvals workflow
  const handleApprovalUpdate = async (status) => {
    try {
      playClick()
      const response = await axiosInstance.post(`/tasks/${id}/approval`, { status })
      setTask(response.data?.task)
      playSuccess()
      toast.success(`Task approval status: ${status}`)
    } catch (error) {
      playError()
      toast.error("Failed to update approval status")
    }
  }

  // Status update workflow
  const handleStatusChange = async (status) => {
    try {
      playClick()
      const response = await axiosInstance.put(`/tasks/${id}/status`, { status })
      setTask(response.data?.task)
      playSuccess()
      toast.success(`Status updated to: ${status}`)
    } catch (error) {
      playError()
      toast.error("Failed to update status")
    }
  }

  const handleLinkClick = (link) => {
    playClick()
    if (!/^https?:\/\//i.test(link)) link = "https://" + link
    window.open(link, "_blank")
  }

  useEffect(() => {
    getTaskDetailsById()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-4 max-w-5xl mx-auto">
          <div className="h-8 w-1/3 bg-slate-900 rounded animate-pulse"></div>
          <div className="h-40 bg-slate-900 rounded animate-pulse"></div>
        </div>
      </DashboardLayout>
    )
  }

  const isAdmin = currentUser?.role === "admin"
  const isAssigned = task?.assignedTo?.some((u) => u._id === currentUser?._id)
  const canUpdateStatus = isAssigned || isAdmin

  return (
    <DashboardLayout activeMenu={isAdmin ? "Manage Task" : "My Tasks"}>
      <motion.div
        className="max-w-5xl mx-auto space-y-6 text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* BACK NAVBAR */}
        <div className="flex justify-between items-center border-b border-slate-900/60 pb-3 select-none">
          <button
            onClick={() => { playClick(); navigate(-1); }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>
          
          <span className="text-[10px] font-mono text-slate-500">TASK_ID: {id?.substring(0, 8)}...</span>
        </div>

        {/* HERO TITLE & DETAILS */}
        <div className="glass-panel bg-slate-900/35 rounded-2xl p-6 border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-wide font-sans">{task?.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-3 select-none">
              {canUpdateStatus ? (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Status:</span>
                  <select
                    value={task?.status || "Pending"}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-2 py-0.5 text-[10px] rounded border font-mono font-bold uppercase tracking-wider bg-slate-950 border-slate-800 text-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              ) : (
                <span className={`px-2.5 py-0.5 text-[10px] rounded border font-mono font-bold uppercase tracking-wider ${getStatusTagColor(task?.status)}`}>
                  {task?.status}
                </span>
              )}
              <span className={`px-2.5 py-0.5 text-[10px] rounded border font-mono font-bold uppercase tracking-wider ${getApprovalTagColor(task?.approvalStatus)}`}>
                Approval: {task?.approvalStatus || "None"}
              </span>
            </div>
          </div>

          {/* APPROVAL ACTIONS CARD */}
          <div className="flex flex-wrap gap-2 select-none">
            {isAdmin ? (
              // Admin Approval overrides
              task?.approvalStatus === "Pending Approval" && (
                <>
                  <button 
                    onClick={() => handleApprovalUpdate("Approved")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <FaCheckCircle className="text-xs" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleApprovalUpdate("Rejected")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <FaTimesCircle className="text-xs" />
                    Reject
                  </button>
                </>
              )
            ) : (
              // User request approval
              (task?.approvalStatus === "None" || task?.approvalStatus === "Rejected") && (
                <button
                  onClick={() => handleApprovalUpdate("Pending Approval")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Request Approval
                </button>
              )
            )}
          </div>
        </div>

        {/* TIME TRACKER PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          <div className="md:col-span-2 glass-panel bg-slate-900/35 p-5 rounded-2xl border-slate-800/80 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-950/60 border border-indigo-900/40 rounded-xl">
                <FaClock className="text-indigo-400 text-sm" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Stopwatch Time Tracker</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-semibold text-slate-200 font-mono tracking-wider">{task?.timeTracked?.toFixed(2) || "0.00"}</span>
                  <span className="text-[10px] text-slate-500">logged mins</span>
                </div>
              </div>
            </div>

            {/* stopwatch trigger controls */}
            <div className="flex items-center gap-3">
              {task?.isTimerRunning ? (
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-rose-400 tracking-wider animate-pulse">{formatElapsed(elapsedSeconds)}</span>
                  <button 
                    onClick={handleStopTimer}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <FaStop className="text-xs" />
                    Stop
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleStartTimer}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <FaPlay className="text-[10px]" />
                  Start Timer
                </button>
              )}
            </div>
          </div>

          <InfoCard label="Priority Level" value={task?.priority} />
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* DESCRIPTION */}
            <div className="glass-panel bg-slate-900/35 p-6 rounded-2xl border-slate-800/80 shadow-2xl">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 font-bold">
                Task Description
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{task?.description || "No description provided."}</p>
            </div>

            {/* CHECKLIST */}
            <div className="glass-panel bg-slate-900/35 p-6 rounded-2xl border-slate-800/80 shadow-2xl">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3.5 font-bold">
                Subtask Checklist
              </h3>
              <div className="space-y-2 select-none">
                {task?.todoChecklist?.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.005 }}
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-900/40 bg-slate-950/20 hover:bg-slate-900/10 transition-all cursor-pointer"
                    onClick={() => updateTodoChecklist(index)}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}} // Handled by parent wrapper click
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer animate-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className={`text-xs ${item.completed ? "line-through text-slate-500 font-medium" : "text-slate-200"}`}>
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* TASK CONVERSATION (COMMENTS) */}
            <div className="glass-panel bg-slate-900/35 p-6 rounded-2xl border-slate-800/80 shadow-2xl flex flex-col h-[400px]">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 font-bold shrink-0">
                Task Conversation Logs
              </h3>

              {/* Comments Feed */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
                {task?.comments?.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs uppercase select-none">
                    No conversation logs recorded 📂
                  </div>
                ) : (
                  task?.comments?.map((c, i) => (
                    <div key={c._id || i} className="flex gap-3 items-start">
                      <img 
                        src={c.user?.profileImageUrl || "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png"} 
                        alt={c.user?.name}
                        className="w-8 h-8 rounded-lg object-cover bg-slate-950 border border-slate-800 shadow shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
                        }}
                      />
                      <div className="text-left min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-slate-200">{c.user?.name || "Deleted User"}</span>
                          <span className="text-[9px] font-mono text-slate-500 tracking-wider">{moment(c.createdAt).fromNow()}</span>
                        </div>
                        <p className="text-xs text-slate-350 leading-relaxed mt-1">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2 shrink-0 border-t border-slate-900/60 pt-3">
                <input 
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share updates or add context comments..."
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all placeholder-slate-650"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </form>
            </div>

          </div>

          {/* SIDE DETAILS COLUMN */}
          <div className="space-y-6">
            
            {/* METADATA TARGETS */}
            <div className="glass-panel bg-slate-900/35 p-4 rounded-2xl border-slate-800/80 shadow-xl space-y-4">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Due Date Target</p>
                <p className="text-xs font-semibold text-slate-200 mt-1 font-mono tracking-wider">
                  {task?.dueDate ? moment(task.dueDate).format("DD MMM YYYY") : "N/A"}
                </p>
              </div>
              <div className="border-t border-slate-900/60 pt-3">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 font-bold">Assigned Members</p>
                <div className="flex items-center">
                  <AvatarGroup avatars={task?.assignedTo?.map((u) => u.profileImageUrl) || []} />
                </div>
              </div>
            </div>

            {/* ATTACHMENTS */}
            {task?.attachments?.length > 0 && (
              <div className="glass-panel bg-slate-900/35 p-5 rounded-2xl border-slate-800/80 shadow-xl select-none">
                <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3.5 font-bold">
                  Resources Attachments
                </h3>

                <div className="space-y-2">
                  {task.attachments.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => handleLinkClick(link)}
                      className="flex justify-between items-center bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-indigo-500/30 hover:bg-slate-900/20 transition-all"
                    >
                      <p className="text-[11px] text-slate-350 truncate font-mono">{link}</p>
                      <FaExternalLinkAlt className="text-slate-500 text-[10px] ml-2 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  )
}

export default TaskDetails

const InfoCard = ({ label, value }) => (
  <div className="glass-panel bg-slate-900/35 p-4 rounded-2xl border-slate-800/80 shadow-xl flex flex-col justify-center select-none">
    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">{label}</p>
    <p className="text-sm font-semibold text-slate-200 mt-1 font-mono tracking-wider">{value}</p>
  </div>
)