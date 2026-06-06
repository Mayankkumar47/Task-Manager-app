import React from "react"
import { motion } from "framer-motion"

const UserCard = ({ userInfo }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-2xl shadow border border-gray-100 space-y-4"
    >

      {/*  USER INFO */}
      <div className="flex items-center gap-3">
        <img
          src={userInfo?.profileImageUrl}
          alt={userInfo?.name}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <p className="text-base font-semibold text-gray-800">
            {userInfo?.name}
          </p>
          <p className="text-sm text-gray-500">
            {userInfo?.email}
          </p>
        </div>
      </div>

      {/*  STATS */}
      <div className="grid grid-cols-3 gap-2">

        <StatCard label="Pending" count={userInfo?.pendingTasks} color="yellow" />
        <StatCard label="Progress" count={userInfo?.inProgressTasks} color="blue" />
        <StatCard label="Done" count={userInfo?.completedTasks} color="green" />

      </div>

    </motion.div>
  )
}

export default UserCard

const StatCard = ({ label, count = 0, color }) => {
  const colorMap = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  }

  return (
    <div className={`flex flex-col items-center justify-center py-2 rounded-lg ${colorMap[color]}`}>
      <span className="text-sm font-semibold">{count}</span>
      <span className="text-[11px]">{label}</span>
    </div>
  )
}