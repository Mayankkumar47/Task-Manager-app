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
    <div className="w-64 h-screen bg-white shadow-md p-5 flex flex-col">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200 bg-gray-100">
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
        </div>
        <h5 className="mt-2 font-semibold text-gray-800">{currentUser?.name}</h5>
        <p className="text-sm text-gray-500 truncate w-full text-center">{currentUser?.email}</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {sideMenuData.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleClick(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors
              ${
                activeMenu === item.label
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <item.icon className="text-lg" />
            {item.label}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => handleClick("logout")}
        className="mt-4 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors text-sm font-medium"
      >
        Logout
      </button>
    </div>
  )
}

export default SideMenu