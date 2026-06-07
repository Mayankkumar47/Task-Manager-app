import React, { useEffect, useState } from "react"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import { FaFileAlt } from "react-icons/fa"
import UserCard from "../../components/UserCard"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { playClick, playSuccess, playError } from "../../utils/soundEffects"

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const getAllUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/users/get-users")
      if (response.data) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    try {
      playClick()
      const response = await axiosInstance.get("/reports/export/users", {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "user_details.xlsx")

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
      playSuccess()
      toast.success("Team member list downloaded!")
    } catch (error) {
      playError()
      toast.error("Download failed")
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/*  HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-3">
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wide text-slate-100 uppercase">
              Team Members
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Manage team accounts and permissions</p>
          </div>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-[var(--color-accent)]/30 text-slate-300 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer"
          >
            <FaFileAlt className="text-[var(--color-accent)]" />
            Download Report
          </button>
        </div>

        {/*  LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl shadow animate-pulse h-36">
                <div className="h-10 w-10 bg-slate-800 rounded-lg mb-3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : allUsers.length > 0 ? (

          /*  USERS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <UserCard userInfo={user} />
              </motion.div>
            ))}
          </div>

        ) : (

          /*  EMPTY STATE */
          <div className="text-center py-16 border border-dashed border-slate-900 p-8 rounded-2xl">
            <p className="text-slate-500 font-mono text-sm">
              No team members found 👤
            </p>
            <p className="text-xs text-slate-600 mt-2 font-sans">
              Registered team members will show up here.
            </p>
          </div>

        )}

      </motion.div>
    </DashboardLayout>
  )
}

export default ManageUsers