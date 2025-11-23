"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"
import { setToken, setUser } from "@/lib/auth"
import { useBudgetStore } from "@/lib/store"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setToken: setStoreToken } = useBudgetStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await loginUser(email, password)
      setToken(data.token)
      setUser(data.user)
      setStoreToken(data.token)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-muted-foreground text-center">Demo credentials are pre-filled above</p>
    </form>
  )
}
