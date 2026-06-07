import React, { useState, useEffect, useRef } from "react"
import DashboardLayout from "../components/DashboardLayout"
import axiosInstance from "../utils/axioInstance"
import { motion } from "framer-motion"
import { FaPaperPlane, FaComments, FaUsers } from "react-icons/fa"
import moment from "moment"
import { playClick, playChime, playError } from "../utils/soundEffects"

const TeamChat = () => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  const fetchMessages = async (isFirstLoad = false) => {
    try {
      const res = await axiosInstance.get("/chats")
      if (res.data) {
        setMessages((prev) => {
          // Play notification sound if new message received from another user
          if (!isFirstLoad && res.data.length > prev.length) {
            const lastMsg = res.data[res.data.length - 1];
            // Check if the message is from someone else
            const currentUserId = localStorage.getItem("user_id"); // Or extracted from user profile
            if (lastMsg.sender?._id !== currentUserId) {
              playChime();
            }
          }
          return res.data;
        })
      }
    } catch (err) {
      console.error("Failed to query chats:", err)
    } finally {
      if (isFirstLoad) {
        setLoading(false)
        setTimeout(() => scrollToBottom("auto"), 100)
      }
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim() || sending) return

    playClick()
    const text = inputText.trim()
    setInputText("")
    setSending(true)

    try {
      const res = await axiosInstance.post("/chats", { text })
      setMessages((prev) => [...prev, res.data])
      setTimeout(() => scrollToBottom(), 50)
    } catch (err) {
      playError()
      console.error("Failed to post message:", err)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchMessages(true)

    // Polling interval (every 4 seconds) to fetch other user messages
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(false)
    }, 4000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  return (
    <DashboardLayout activeMenu="Team Chat">
      <motion.div 
        className="h-[calc(100vh-120px)] flex flex-col glass-panel rounded-2xl border-slate-800/80 bg-slate-900/35 overflow-hidden text-left relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-900/60 bg-slate-950/20 flex justify-between items-center z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-950/60 border border-indigo-900/40 rounded-xl">
              <FaComments className="text-indigo-400 text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-wide font-mono uppercase">Global Team Chat Room</h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Teammates discussion channel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 text-[10px] font-mono font-bold uppercase">
            <FaUsers className="text-indigo-400" />
            <span>Active Channel</span>
          </div>
        </div>

        {/* Messages history view */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-950/15">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-slate-800 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-850 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-slate-500 font-mono text-xs uppercase space-y-2 py-20 select-none">
              <p>No messages in general room channel 📂</p>
              <p className="text-[10px] text-slate-600 font-sans normal-case">Send a message below to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg._id || idx} className="flex items-start gap-3 hover:bg-slate-900/10 p-1.5 rounded-xl transition-all">
                <img 
                  src={msg.sender?.profileImageUrl || "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png"} 
                  alt={msg.sender?.name}
                  className="w-8.5 h-8.5 rounded-lg object-cover bg-slate-950 border border-slate-800 shadow shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
                  }}
                />
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-200">{msg.sender?.name || "Deleted User"}</span>
                    <span className="text-[9px] font-mono text-slate-500 tracking-wider">
                      {moment(msg.createdAt).format("h:mm A")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-350 leading-relaxed mt-1 whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Console Input bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-900/60 bg-[#070b13]/85 backdrop-blur-md z-10 flex gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Discuss updates with teammates in the channel..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800/80 text-slate-100 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all placeholder-slate-600"
            disabled={sending}
          />
          
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </form>
      </motion.div>
    </DashboardLayout>
  )
}

export default TeamChat
