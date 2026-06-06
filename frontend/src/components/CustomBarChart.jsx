import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { motion } from "framer-motion"

const CustomBarChart = ({ data }) => {

  //  Better color mapping
  const getBarColor = (entry) => {
    switch (entry?.priority) {
      case "Low":
        return "#22c55e" // green
      case "Medium":
        return "#f59e0b" // orange
      case "High":
        return "#ef4444" // red
      default:
        return "#22c55e"
    }
  }

  //  Tooltip UI upgrade
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload

      return (
        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-500">
            Priority
          </p>

          <p className="text-sm font-medium text-gray-800">
            {item.priority}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Count:{" "}
            <span className="font-semibold text-gray-900">
              {item.count}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white p-4 rounded-2xl shadow border border-gray-100"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

          {/* X Axis */}
          <XAxis
            dataKey="priority"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomToolTip />}
            cursor={{ fill: "#f9fafb" }}
          />

          {/* Bars */}
          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
          >
            {data?.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default CustomBarChart