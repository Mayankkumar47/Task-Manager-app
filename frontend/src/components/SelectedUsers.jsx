import React, { useEffect, useState } from "react"
import { FaUsers } from "react-icons/fa"
import Modal from "./Modal"
import AvatarGroup from "./AvatarGroup"
import { motion } from "framer-motion"
import axioInstance from "../utils/axioInstance"
import { playClick } from "../utils/soundEffects"

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
    playClick()
    setTempSelectedUser((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const handleAssign = () => {
    playClick()
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
    if (selectedUser.length === 0) {
      setTempSelectedUser([])
    } else {
      // Map initial IDs correctly
      setTempSelectedUser(selectedUser)
    }
  }, [selectedUser])

  return (
    <div className="space-y-3 text-left">
      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Assign Node Members</label>
      
      {selectedUserAvatars.length === 0 ? (
        <button
          type="button"
          onClick={() => { playClick(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-[var(--color-accent)]/30 text-slate-300 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer"
        >
          <FaUsers className="text-[var(--color-accent)] text-sm" />
          Assign Nodes
        </button>
      ) : (
        <div
          onClick={() => { playClick(); setIsModalOpen(true); }}
          className="cursor-pointer inline-block bg-slate-900/40 border border-slate-900 hover:border-[var(--color-accent)]/30 px-3.5 py-1.5 rounded-xl shadow-lg transition-all"
        >
          <div className="flex items-center gap-2.5">
            <AvatarGroup avatars={selectedUserAvatars} />
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">{selectedUser.length} ASSIGNED</span>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Map System Nodes"
      >
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 select-none">
          {allUsers.map((user, index) => {
            const isChecked = tempSelectedUser.includes(user._id);
            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                  ${
                    isChecked
                      ? "bg-slate-900 border-[var(--color-accent)]/40 text-[var(--color-accent)] shadow shadow-[var(--color-glow)]"
                      : "hover:bg-slate-900/40 border-slate-900 text-slate-300"
                  }`}
                onClick={() => toggleUserSelection(user._id)}
              >
                <img
                  src={user.profileImageUrl || "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png"}
                  alt={user.name}
                  className="w-9 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/dbli9atjv/image/upload/v1713535800/avatar.png";
                  }}
                />

                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 rounded text-[var(--color-accent)] bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-900 mt-4 font-mono text-[10px] uppercase">
          <button
            type="button"
            onClick={() => { playClick(); setIsModalOpen(false); }}
            className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-slate-950 font-bold hover:brightness-110 transition shadow shadow-[var(--color-glow)] cursor-pointer"
          >
            Deploy Map
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers;