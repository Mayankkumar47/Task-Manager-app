import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomBarChart = ({ data }) => {
  return (
    <div className="w-full h-[300px] bg-slate-950/40 p-2 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          {/* Injecting custom SVG Gradients and Neon Filters */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="priority" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          
          {/* Cyberpunk Dark Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2, 6, 23, 0.9)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "12px",
              color: "#f8fafc",
              fontFamily: "monospace",
              fontSize: "12px"
            }}
            cursor={{ fill: "rgba(30, 41, 59, 0.4)", radius: 8 }}
          />

          <Bar 
            dataKey="count" 
            fill="url(#barGradient)" 
            radius={[8, 8, 0, 0]} 
            filter="url(#glow)"
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;