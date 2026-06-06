import React from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"
import { motion } from "framer-motion"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen flex bg-gray-100">

      {currentUser && (
        <div className="w-64 hidden md:block">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}

      <div className="flex-1 flex flex-col">

        <div className="bg-white shadow-sm px-6 py-3">
          <Navbar activeMenu={activeMenu} />
        </div>

        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>

      </div>
    </div>
  )
}

export default DashboardLayout