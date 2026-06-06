import React from "react"
import { motion } from "framer-motion"

const Progress = ({ progress = 0, status }) => {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-cyan-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-violet-500"
    }
  }

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

      <motion.div
        className={`h-full ${getColor()} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />

    </div>
  )
}

export default Progress