import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

const Dashboard = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]

    setBarChartData(priorityLevelData)
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/dashboard-data")

      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.log("Error fetching dashboard data: ", error)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-6">

        {/*  HEADER */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Welcome back, {currentUser?.name} 👋
            </h2>
            <p className="text-blue-100 mt-1">
              {moment().format("dddd, Do MMM YYYY")}
            </p>
          </div>

          <button
            className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-xl font-medium shadow transition"
            onClick={() => navigate("/admin/create-task")}
          >
            + New Task
          </button>
        </div>

        {/*  STATS CARDS */}
        {dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <h2 className="text-3xl font-bold mt-2 text-blue-600">
                {dashboardData?.charts?.taskDistribution?.All || 0}
              </h2>
            </div>

            <div className="bg-yellow-50 p-5 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-yellow-600 text-sm">Pending</p>
              <h2 className="text-3xl font-bold mt-2">
                {dashboardData?.charts?.taskDistribution?.Pending || 0}
              </h2>
            </div>

            <div className="bg-green-50 p-5 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-green-600 text-sm">In Progress</p>
              <h2 className="text-3xl font-bold mt-2">
                {dashboardData?.charts?.taskDistribution?.InProgress || 0}
              </h2>
            </div>

            <div className="bg-red-50 p-5 rounded-2xl shadow hover:shadow-lg transition">
              <p className="text-red-600 text-sm">Completed</p>
              <h2 className="text-3xl font-bold mt-2">
                {dashboardData?.charts?.taskDistribution?.Completed || 0}
              </h2>
            </div>

          </div>
        )}

        {/*  CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Task Distribution
            </h3>
            <div className="h-64">
              <CustomPieChart
                data={pieChartData}
                label="Tasks"
                colors={COLORS}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Task Priority Levels
            </h3>
            <div className="h-64">
              <CustomBarChart data={barChartData} />
            </div>
          </div>

        </div>

        {/*  RECENT TASKS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <RecentTasks tasks={dashboardData?.recentTasks} />
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Dashboard