"use client"

import { useBudgetStore } from "@/lib/store"

interface CategoryInputProps {
  label: string
  icon: string
  value: number
  onChange: (value: number) => void
}

export default function CategoryInput({ label, icon, value, onChange }: CategoryInputProps) {
  const { budget } = useBudgetStore()
  const incomeAmount = budget.income || 0
  const percentage = incomeAmount > 0 ? (value / incomeAmount) * 100 : 0

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 font-medium text-foreground">
          <span className="text-xl">{icon}</span>
          {label}
        </label>
        <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-primary">₹</span>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
