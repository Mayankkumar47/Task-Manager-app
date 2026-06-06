import React from "react"
import moment from "moment"
import AvatarGroup from "./AvatarGroup"
import { FaFileLines } from "react-icons/fa6"
import { motion } from "framer-motion"
import Progress from "./Progress"

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {

  const getStatusTag = () => {
    if (status === "Completed") return "bg-green-100 text-green-700"
    if (status === "In Progress") return "bg-blue-100 text-blue-700"
    return "bg-yellow-100 text-yellow-700"
  }

  const getPriorityTag = () => {
    if (priority === "High") return "bg-red-100 text-red-700"
    if (priority === "Medium") return "bg-orange-100 text-orange-700"
    return "bg-green-100 text-green-700"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow border border-gray-100 cursor-pointer space-y-3"
    >

      {/*  Tags */}
      <div className="flex gap-2">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusTag()}`}>
          {status}
        </span>

        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityTag()}`}>
          {priority}
        </span>
      </div>

      {/*  Title */}
      <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
        {title}
      </h3>

      {/*  Description */}
      <p className="text-sm text-gray-500 line-clamp-2">
        {description}
      </p>

      {/*  Progress */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          Progress: {completedTodoCount} / {todoChecklist.length || 0}
        </p>
        <Progress progress={progress} status={status} />
      </div>

      {/*  Dates */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          Start:{" "}
          <span className="text-gray-700 font-medium">
            {moment(createdAt).format("DD MMM")}
          </span>
        </span>

        <span>
          Due:{" "}
          <span className="text-gray-700 font-medium">
            {moment(dueDate).format("DD MMM")}
          </span>
        </span>
      </div>

      {/*  Footer */}
      <div className="flex items-center justify-between pt-1">
        <AvatarGroup avatars={assignedTo || []} />

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded-md">
            <FaFileLines className="text-blue-500" />
            {attachmentCount}
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default TaskCard