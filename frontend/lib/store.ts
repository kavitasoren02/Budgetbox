import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export interface Budget {
  income: number
  categories: {
    bills: number
    food: number
    transport: number
    subscriptions: number
    miscellaneous: number
  }
}

export interface BudgetStore {
  budget: Budget
  syncStatus: "local-only" | "sync-pending" | "synced"
  isOnline: boolean
  token: string | null

  // Actions
  setBudget: (budget: Partial<Budget>) => void
  setCategory: (category: keyof Budget["categories"], value: number) => void
  setIncome: (value: number) => void
  setSyncStatus: (status: "local-only" | "sync-pending" | "synced") => void
  setIsOnline: (online: boolean) => void
  setToken: (token: string | null) => void
  reset: () => void
}

const initialBudget: Budget = {
  income: 0,
  categories: {
    bills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    miscellaneous: 0,
  },
}

export const useBudgetStore = create<BudgetStore>()(
  subscribeWithSelector((set) => ({
    budget: initialBudget,
    syncStatus: "local-only",
    isOnline: typeof window !== "undefined" ? navigator.onLine : true,
    token: null,

    setBudget: (partial) =>
      set((state) => ({
        budget: { ...state.budget, ...partial },
      })),

    setCategory: (category, value) =>
      set((state) => ({
        budget: {
          ...state.budget,
          categories: {
            ...state.budget.categories,
            [category]: value,
          },
        },
      })),

    setIncome: (value) =>
      set((state) => ({
        budget: { ...state.budget, income: value },
      })),

    setSyncStatus: (status) => set({ syncStatus: status }),
    setIsOnline: (online) => set({ isOnline: online }),
    setToken: (token) => set({ token }),
    reset: () =>
      set({
        budget: initialBudget,
        syncStatus: "local-only",
        token: null,
      }),
  })),
)
