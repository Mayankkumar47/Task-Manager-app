import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"
import { motion } from "framer-motion"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState(null)
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const [loading, setLoading] = useState(true)

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    setPieChartData([
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ])

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ])
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data")

      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data?.charts)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  // LOADING UI
  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <motion.div
        className="p-6 space-y-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/*  HEADER */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 shadow text-white">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.name} 👋
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            {moment().format("dddd, Do MMM YYYY")}
          </p>
        </div>

        {/*  OVERVIEW */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              ["Total Tasks", dashboardData?.charts?.taskDistribution?.All, "blue"],
              ["Pending", dashboardData?.charts?.taskDistribution?.Pending, "yellow"],
              ["In Progress", dashboardData?.charts?.taskDistribution?.InProgress, "green"],
              ["Completed", dashboardData?.charts?.taskDistribution?.Completed, "red"],
            ].map(([title, value, color], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`p-5 rounded-2xl shadow border border-gray-100 bg-${color}-50`}
              >
                <p className={`text-sm text-${color}-600`}>{title}</p>
                <h2 className="text-3xl font-bold mt-1 text-gray-800">
                  {value || 0}
                </h2>
              </motion.div>
            ))}

          </div>
        </div>

        {/*  ANALYTICS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Analytics
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-medium mb-3">Task Distribution</h4>
              <CustomPieChart data={pieChartData} colors={COLORS} />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-medium mb-3">Task Priority</h4>
              <CustomBarChart data={barChartData} />
            </motion.div>

          </div>
        </div>

        {/*  RECENT TASKS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Recent Tasks
          </h3>

          <div className="bg-white p-6 rounded-2xl shadow">
            {dashboardData?.recentTasks?.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No tasks yet. Start working 🚀
              </p>
            ) : (
              <RecentTasks tasks={dashboardData?.recentTasks} />
            )}
          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  )
}

export default UserDashboard