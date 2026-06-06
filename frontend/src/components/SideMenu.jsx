import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data"
import { motion } from "framer-motion"
import axioInstance from "../utils/axioInstance"

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [sideMenuData, setSideMenuData] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout()
      return
    }
    navigate(route)
  }

  const handleLogout = async () => {
    try {
      const response = await axioInstance.post("/auth/sign-out")
      if (response.data) {
        dispatch(signOutSuccess())
        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser?.role === "admin"
          ? SIDE_MENU_DATA
          : USER_SIDE_MENU_DATA
      )
    }
  }, [currentUser])

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col font-sans select-none">
      
      {/* 👤 PROFILE BLOCK - Floating Glass Identity Hub */}
      <div className="flex flex-col items-center mb-8 bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-4 rounded-2xl shadow-xl">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30 bg-slate-950 shadow-md shadow-cyan-500/5">
          <img
            src={
              currentUser?.profileImageUrl ||
              import.meta.env.VITE_DEFAULT_PROFILE_IMAGE
            }
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
            }}
          />
          {/* Status Indicator Dot */}
          <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse"></div>
        </div>
        <h5 className="mt-3 font-bold tracking-wide text-slate-100">{currentUser?.name}</h5>
        <p className="text-xs text-slate-500 truncate w-full text-center font-mono mt-0.5">{currentUser?.email}</p>
        
        {/* Dynamic Role Badge */}
        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 mt-2 rounded-md border ${
          currentUser?.role === "admin" 
            ? "bg-red-500/10 text-red-400 border-red-500/20" 
            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        }`}>
          {currentUser?.role || "user"} node
        </span>
      </div>

      {/* 🧭 NAVIGATION TRACK - Interactive Glass Options */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {sideMenuData.map((item, index) => {
          const isActive = activeMenu === item.label;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group
                ${
                  isActive
                    ? "bg-slate-900/80 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/5 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
                }`}
            >
              {/* Active neon anchoring node line */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-md"></div>
              )}
              
              <item.icon className={`text-lg transition-colors ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span>{item.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* 🚪 EXIT TRIGGER - Isolated Crimson Container */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleClick("logout")}
        className="mt-4 text-center text-xs font-mono font-bold uppercase tracking-wider text-red-400/90 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 px-4 py-3 rounded-xl transition-all"
      >
        Sign Out System
      </motion.button>
      
    </div>
  )
}

export default SideMenu;