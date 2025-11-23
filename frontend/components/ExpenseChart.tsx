"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ChartDataPoint {
  name: string
  value: number
}

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"]

export default function ExpenseChart({ data }: { data: ChartDataPoint[] }) {
  const validData = data.filter((item) => item.value > 0)

  if (validData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Add some expenses to see the chart
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={validData as any}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) => `${name}: ₹${value} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {validData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
