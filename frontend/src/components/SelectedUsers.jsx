import React, { useEffect, useState } from "react"
import { FaUsers } from "react-icons/fa"
import Modal from "./Modal"
import AvatarGroup from "./AvatarGroup"
import { motion } from "framer-motion"
import axioInstance from "../utils/axioInstance"

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUser, setTempSelectedUser] = useState([])

  const getAllUsers = async () => {
    try {
      const res = await axioInstance.get("/users/get-users")
      setAllUsers(res.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  const toggleUserSelection = (id) => {
    setTempSelectedUser((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const handleAssign = () => {
    setSelectedUser(tempSelectedUser)
    setIsModalOpen(false)
  }

  const selectedUserAvatars = allUsers
    .filter((u) => selectedUser.includes(u._id))
    .map((u) => u.profileImageUrl || "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png")

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (selectedUser.length === 0) setTempSelectedUser([])
  }, [selectedUser])

  return (
    <div className="space-y-3">
      {selectedUserAvatars.length === 0 ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaUsers />
          Add Members
        </button>
      ) : (
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer inline-block"
        >
          <AvatarGroup avatars={selectedUserAvatars} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Team Members"
      >
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {allUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${
                  tempSelectedUser.includes(user._id)
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50 border-gray-100"
                }`}
              onClick={() => toggleUserSelection(user._id)}
            >
              <img
                src={user.profileImageUrl || "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png"}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover bg-gray-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
                }}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUser.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers