"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useBudgetStore } from "@/lib/store"
import { saveBudgetLocal } from "@/lib/db"
import CategoryInput from "./CategoryInput"

export default function BudgetForm() {
  const { budget, setSyncStatus, setCategory, setIncome, syncStatus } = useBudgetStore()
  const [saveIndicator, setSaveIndicator] = useState(false)

  // Auto-save whenever budget changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      await saveBudgetLocal(budget)
      setSaveIndicator(true)
      setTimeout(() => setSaveIndicator(false), 2000)
      setSyncStatus("sync-pending")
    }, 500)

    return () => clearTimeout(timer)
  }, [budget, setSyncStatus])

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setIncome(value)
  }

  const handleCategoryChange = (category: keyof typeof budget.categories, value: number) => {
    setCategory(category, value)
  }

  const categories: Array<{
    key: keyof typeof budget.categories
    label: string
    icon: string
  }> = [
    { key: "bills", label: "Monthly Bills", icon: "🏠" },
    { key: "food", label: "Food & Groceries", icon: "🍔" },
    { key: "transport", label: "Transport", icon: "🚗" },
    { key: "subscriptions", label: "Subscriptions", icon: "📺" },
    { key: "miscellaneous", label: "Miscellaneous", icon: "🎁" },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Monthly Budget</h2>

        {/* Income Input */}
        <div className="mb-6 p-4 bg-card rounded-lg border border-border">
          <label className="block text-sm font-medium text-foreground mb-2">Monthly Income</label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">₹</span>
            <input
              type="number"
              value={budget.income || ""}
              onChange={handleIncomeChange}
              placeholder="Enter your monthly income"
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryInput
              key={cat.key}
              label={cat.label}
              icon={cat.icon}
              value={budget.categories[cat.key]}
              onChange={(value) => handleCategoryChange(cat.key, value)}
            />
          ))}
        </div>
      </div>

      {/* Save Status Indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {saveIndicator && <span className="text-success">✓ Saved locally</span>}
          {syncStatus === "sync-pending" && <span className="text-warning">⟳ Waiting to sync</span>}
          {syncStatus === "synced" && <span className="text-success">✓ Synced</span>}
          {syncStatus === "local-only" && <span className="text-muted-foreground">⊘ Local only</span>}
        </div>
      </div>
    </div>
  )
}
