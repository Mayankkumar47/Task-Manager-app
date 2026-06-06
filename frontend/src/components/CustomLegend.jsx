import React from "react"
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">

      {payload?.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 shadow-sm hover:bg-gray-100 transition"
        >
          {/*  Color Dot */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />

          {/*  Label */}
          <span className="text-xs font-medium text-gray-700">
            {entry.value}
          </span>
        </div>
      ))}

    </div>
  )
}

export default CustomLegend