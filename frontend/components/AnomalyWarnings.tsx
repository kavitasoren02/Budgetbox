"use client"

import type { Budget } from "@/lib/store"

interface AnomalyWarningsProps {
  budget: Budget
  income: number
}

export default function AnomalyWarnings({ budget, income }: AnomalyWarningsProps) {
  const warnings: Array<{ type: "error" | "warning"; message: string }> = []

  if (income === 0) {
    warnings.push({
      type: "warning",
      message: "Please enter your monthly income to get insights",
    })
  } else {
    const { bills, food, transport, subscriptions, miscellaneous } = budget.categories
    const totalSpend = bills + food + transport + subscriptions + miscellaneous

    // Check anomalies
    if (totalSpend > income) {
      warnings.push({
        type: "error",
        message: "⚠ Your expenses exceed your income! You are overspending.",
      })
    }

    if (bills / income > 0.5) {
      warnings.push({
        type: "warning",
        message: `⚠ Bills are ${((bills / income) * 100).toFixed(0)}% of your income — too high!`,
      })
    }

    if (food / income > 0.4) {
      warnings.push({
        type: "warning",
        message: `⚠ Food spending is ${((food / income) * 100).toFixed(0)}% of your income — reduce this next month.`,
      })
    }

    if (subscriptions / income > 0.3) {
      warnings.push({
        type: "warning",
        message: `⚠ Subscriptions are ${((subscriptions / income) * 100).toFixed(0)}% of your income — consider cancelling unused apps.`,
      })
    }

    if (transport / income > 0.25) {
      warnings.push({
        type: "warning",
        message: `⚠ Transport costs are ${((transport / income) * 100).toFixed(0)}% of your income — consider carpooling.`,
      })
    }

    if (totalSpend > 0 && totalSpend / income < 0.3) {
      warnings.push({
        type: "warning",
        message: `✓ Great! You are spending only ${((totalSpend / income) * 100).toFixed(0)}% of your income.`,
      })
    }
  }

  if (warnings.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Smart Insights</h3>
      {warnings.map((warning, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg border ${
            warning.type === "error"
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-warning/10 border-warning/20 text-warning"
          }`}
        >
          <p className="text-sm font-medium">{warning.message}</p>
        </div>
      ))}
    </div>
  )
}
