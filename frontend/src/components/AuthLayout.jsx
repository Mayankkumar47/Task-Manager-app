import React from "react"
import { motion } from "framer-motion"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/*  LEFT (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 py-10">
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.div>
      </div>

      {/*  RIGHT (IMAGE + OVERLAY) */}
      <div className="hidden md:flex w-1/2 relative">

        <img
          src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-indigo-700/70"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white text-center px-10">
          <h2 className="text-3xl font-bold mb-3">
            Welcome to TaskFlow
          </h2>
          <p className="text-sm opacity-90">
            Manage tasks, collaborate with your team, and stay productive.
          </p>
        </div>

      </div>
    </div>
  )
}

export default AuthLayout