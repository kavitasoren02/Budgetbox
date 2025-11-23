"use client"

import { useBudgetStore } from "@/lib/store"
import AnalyticsCard from "./AnalyticsCard"
import AnomalyWarnings from "./AnomalyWarnings"
import ExpenseChart from "./ExpenseChart"

export default function Dashboard() {
  const { budget } = useBudgetStore()

  const totalExpenses = Object.values(budget.categories).reduce((a, b) => a + b, 0)
  const savingsPotential = budget.income - totalExpenses
  const burnRate = budget.income > 0 ? (totalExpenses / budget.income) * 100 : 0

  // Month-End Prediction: Assuming linear spending pattern
  const daysInMonth = 30
  const daysPassed = Math.ceil((new Date().getDate() / daysInMonth) * 30)
  const projectedSpend = daysPassed > 0 ? (totalExpenses / daysPassed) * daysInMonth : totalExpenses
  const projectedSavings = budget.income - projectedSpend

  const chartData = Object.entries(budget.categories).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
  }))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Financial Dashboard</h2>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString("en-IN")}`}
          subtitle="Sum of all categories"
          color="destructive"
        />
        <AnalyticsCard
          title="Savings Potential"
          value={`₹${Math.max(0, savingsPotential).toLocaleString("en-IN")}`}
          subtitle={savingsPotential < 0 ? "Overspending!" : "Left for month"}
          color={savingsPotential < 0 ? "destructive" : "success"}
        />
        <AnalyticsCard
          title="Burn Rate"
          value={`${burnRate.toFixed(1)}%`}
          subtitle="Expenses vs Income"
          color={burnRate > 90 ? "destructive" : burnRate > 70 ? "warning" : "success"}
        />
        <AnalyticsCard
          title="Month-End Projection"
          value={`₹${Math.max(0, projectedSavings).toLocaleString("en-IN")}`}
          subtitle={projectedSavings < 0 ? "Deficit projected" : "Projected savings"}
          color={projectedSavings < 0 ? "destructive" : "success"}
        />
      </div>

      {/* Chart */}
      <div className="p-6 bg-card rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Expense Breakdown</h3>
        <ExpenseChart data={chartData} />
      </div>

      {/* Anomaly Warnings */}
      <AnomalyWarnings budget={budget} income={budget.income} />
    </div>
  )
}
