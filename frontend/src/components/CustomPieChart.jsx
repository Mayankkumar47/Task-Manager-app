import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomPieChart = ({ data }) => {
  // Define 3 explicit gradient maps to match our Pending, InProgress, and Completed colors
  return (
    <div className="w-full h-[300px] bg-slate-950/40 p-2 rounded-xl flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="pendingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="completedGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2, 6, 23, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f8fafc",
              fontSize: "12px"
            }}
          />

          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}  // Hollows out the center to look premium
            outerRadius={85}
            paddingAngle={5}  // Adds elegant spacing between slices
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry, index) => {
              // Dynamically apply gradients based on status string
              let gradient = "url(#progressGrad)";
              if (entry.status === "Pending") gradient = "url(#pendingGrad)";
              if (entry.status === "Completed") gradient = "url(#completedGrad)";
              
              return <Cell key={`cell-${index}`} fill={gradient} stroke="rgba(15, 23, 42, 0.6)" strokeWidth={2} />;
            })}
          </Pie>

          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs font-mono text-slate-400 px-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;