import React from "react"
import { motion } from "framer-motion"

const TaskStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-2">

      {tabs.map((tab) => (
        <motion.button
          key={tab.label}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab(tab.label)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
            ${
              activeTab === tab.label
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          <span>{tab.label}</span>

          <span
            className={`text-xs px-2 py-0.5 rounded-full
              ${
                activeTab === tab.label
                  ? "bg-white text-blue-600"
                  : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {tab.count}
          </span>
        </motion.button>
      ))}

    </div>
  )
}

export default TaskStatusTabs