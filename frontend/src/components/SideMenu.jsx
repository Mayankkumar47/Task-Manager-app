import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data"
import { motion } from "framer-motion"
import axioInstance from "../utils/axioInstance"
import { playClick } from "../utils/soundEffects"

const SideMenu = ({ activeMenu, onNavigate }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [sideMenuData, setSideMenuData] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  const handleClick = (route) => {
    playClick()
    if (onNavigate) {
      onNavigate() // Automatically dismisses the mobile drawer
    }
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
      console.log("Logout failure: ", error)
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
    <div className="w-full h-full bg-[#070b13] border-r border-slate-900/60 p-5 flex flex-col font-sans select-none relative z-10 shrink-0">
      
      {/* 👤 IDENTITY PROFILE HUB */}
      <div className="flex flex-col items-center mb-6 bg-slate-900/15 border border-slate-900/40 p-4 rounded-2xl shadow-sm relative overflow-hidden backdrop-blur-md">
        
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-sm transition-all duration-300 hover:border-indigo-500/40">
          <img
            src={
              currentUser?.profileImageUrl ||
              "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png"
            }
            alt="Profile Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
            }}
          />
          {/* Active online status sensor */}
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></div>
        </div>
        
        <h5 className="mt-3 font-bold tracking-wide text-slate-100 text-xs truncate w-full text-center">{currentUser?.name}</h5>
        <p className="text-[10px] text-slate-500 truncate w-full text-center mt-0.5">{currentUser?.email}</p>
        
        {/* User Role Badge */}
        <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 mt-2.5 rounded border ${
          currentUser?.role === "admin" 
            ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
        }`}>
          {currentUser?.role === "admin" ? "Administrator" : "Team Member"}
        </span>
      </div>

      {/* 🧭 NAVIGATION TRACK PIPELINES */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
        {sideMenuData.map((item, index) => {
          const isActive = activeMenu === item.label;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.015, x: 1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all relative group cursor-pointer
                ${
                  isActive
                    ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow shadow-indigo-500/5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/20 border border-transparent"
                }`}
            >
              {/* Active sidebar line highlight */}
              {isActive && (
                <div className="absolute left-0 top-3.5 bottom-3.5 w-0.5 bg-indigo-500 rounded-r-md"></div>
              )}
              
              <item.icon className={`text-base transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-350"}`} />
              <span>{item.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* SIGN OUT */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleClick("logout")}
        className="mt-4 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/10 border border-rose-900/30 hover:bg-rose-950/20 hover:border-rose-900/40 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
      >
        Sign Out
      </motion.button>
      
    </div>
  )
}

export default SideMenu;