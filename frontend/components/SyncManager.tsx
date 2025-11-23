"use client"

import { useEffect, useState } from "react"
import { useBudgetStore } from "@/lib/store"
import { syncBudget, fetchLatestBudget } from "@/lib/api"
import { saveBudgetLocal } from "@/lib/db"

export default function SyncManager() {
  const { budget, token, isOnline, setSyncStatus, syncStatus, setBudget } = useBudgetStore()
  const [syncing, setSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => {
      useBudgetStore.setState({ isOnline: true })
      // Auto-sync when coming online
      attemptSync()
    }

    const handleOffline = () => {
      useBudgetStore.setState({ isOnline: false })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Auto-sync when sync status is pending and online
  useEffect(() => {
    if (isOnline && syncStatus === "sync-pending" && token && !syncing) {
      const timer = setTimeout(attemptSync, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, syncStatus, token, syncing])

  const attemptSync = async () => {
    if (!token || !isOnline) return

    setSyncing(true)
    setError(null)

    try {
      await syncBudget(token, budget)
      setSyncStatus("synced")
      setLastSyncTime(new Date().toLocaleTimeString())
    } catch (err: any) {
      setError(err.message || "Sync failed")
      setSyncStatus("sync-pending")
    } finally {
      setSyncing(false)
    }
  }

  const handleManualSync = async () => {
    await attemptSync()
  }

  const handleFetchLatest = async () => {
    if (!token) return

    setSyncing(true)
    try {
      const data = await fetchLatestBudget(token)
      if (data.budget) {
        setBudget(data.budget)
        await saveBudgetLocal(data.budget)
        setSyncStatus(data.budget.syncStatus || "synced")
        setLastSyncTime(new Date().toLocaleTimeString())
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="p-4 bg-card rounded-lg border border-border space-y-3">
      {/* Status Display */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Sync Status</p>
          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-destructive"}`} />
            <span className="text-muted-foreground">{isOnline ? "Online" : "Offline Mode"}</span>
          </div>
        </div>

        <div className="space-y-1 text-right">
          <p className="text-sm font-medium text-foreground">
            {syncStatus === "synced" && "✓ Synced"}
            {syncStatus === "sync-pending" && "⟳ Sync Pending"}
            {syncStatus === "local-only" && "⊘ Local Only"}
          </p>
          {lastSyncTime && <p className="text-xs text-muted-foreground">Last: {lastSyncTime}</p>}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {token && (
        <div className="flex gap-2">
          <button
            onClick={handleManualSync}
            disabled={syncing || !isOnline}
            className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition cursor-pointer"
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
          <button
            onClick={handleFetchLatest}
            disabled={syncing || !isOnline}
            className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground border border-border rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition cursor-pointer"
          >
            Pull Latest
          </button>
        </div>
      )}

      {!isOnline && (
        <p className="text-xs text-muted-foreground italic">
          You are offline. Changes are saved locally and will sync when you go online.
        </p>
      )}
    </div>
  )
}
