import React, { useEffect, useState } from "react"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import { FaFileAlt } from "react-icons/fa"
import UserCard from "../../components/UserCard"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

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
    } catch (error) {
      toast.error("Download failed")
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/*  HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Team Members
          </h2>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition"
          >
            <FaFileAlt />
            Download
          </button>
        </div>

        {/*  LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse">
                <div className="h-12 w-12 bg-gray-300 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <UserCard userInfo={user} />
              </motion.div>
            ))}
          </div>

        ) : (

          /*  EMPTY STATE */
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No users found 👤
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Add users to start managing your team
            </p>
          </div>

        )}

      </motion.div>
    </DashboardLayout>
  )
}

export default ManageUsers