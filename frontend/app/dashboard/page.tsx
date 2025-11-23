"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, getUser, removeToken, removeUser } from "@/lib/auth"
import { useBudgetStore } from "@/lib/store"
import { getBudgetLocal } from "@/lib/db"
import { fetchLatestBudget } from "@/lib/api"
import BudgetForm from "@/components/BudgetForm"
import Dashboard from "@/components/Dashboard"
import SyncManager from "@/components/SyncManager"

export default function DashboardPage() {
    const router = useRouter()
    const { setToken, setBudget } = useBudgetStore()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<"form" | "dashboard">("dashboard")

    useEffect(() => {
        const initPage = async () => {
            const token = getToken()
            const currentUser = getUser()

            if (!token) {
                router.push("/")
                return
            }

            setToken(token)
            setUser(currentUser)

            // Load budget from IndexedDB first
            const localBudget = await getBudgetLocal()
            if (localBudget) {
                setBudget(localBudget)
            }

            // Try to fetch latest from server
            try {
                if (navigator.onLine) {
                    const data = await fetchLatestBudget(token)
                    if (data.budget) {
                        setBudget(data.budget)
                    }
                }
            } catch (err) {
                console.log("Failed to fetch from server, using local data")
            }

            setIsLoading(false)
        }

        initPage()
    }, [router, setToken, setBudget])

    const handleLogout = () => {
        removeToken()
        removeUser()
        useBudgetStore.getState().reset()
        router.push("/")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">BudgetBox</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm font-medium text-destructive bg-primary hover:bg-primary/80 cursor-pointer rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Sync Manager */}
                <div className="mb-8 max-w-md">
                    <SyncManager />
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-border">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`px-4 py-2 font-medium border-transparent transition cursor-pointer ${activeTab === "dashboard"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("form")}
                        className={`px-4 py-2 font-medium border-transparent transition cursor-pointer ${activeTab === "form"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Edit Budget
                    </button>
                </div>

                {/* Content */}
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "form" && <BudgetForm />}
            </main>
        </div>
    )
}
