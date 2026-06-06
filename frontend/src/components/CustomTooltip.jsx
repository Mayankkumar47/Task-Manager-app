import React from "react"

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0]

    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">

        {/*  Label */}
        <p className="text-xs text-gray-500 font-medium">
          {item.name}
        </p>

        {/*  Value */}
        <p className="text-sm font-semibold text-gray-800 mt-1">
          {item.value}
        </p>

      </div>
    )
  }

  return null
}

export default CustomTooltip