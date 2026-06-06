import React from "react"
import {
  Pie,
  PieChart,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { motion } from "framer-motion"
import CustomTooltip from "./CustomTooltip"
import CustomLegend from "./CustomLegend"

const CustomPieChart = ({ data, colors }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white p-4 rounded-2xl shadow border border-gray-100"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          {/*  PIE */}
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={4}
            dataKey="count"
            nameKey="status"
          >
            {data?.map((entry, index) => (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>

          {/*  TOOLTIP */}
          <Tooltip content={<CustomTooltip />} />

          {/*  LEGEND */}
          <Legend content={<CustomLegend />} />

        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default CustomPieChart