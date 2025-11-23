"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">BudgetBox</h1>
          <p className="text-muted-foreground">Offline-first personal budgeting</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          {isLogin ? (
            <>
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">Login</h2>
              <LoginForm />
              <div className="mt-4 text-center text-sm">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-medium">
                    Register
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">Create Account</h2>
              <RegisterForm />
              <div className="mt-4 text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-medium">
                    Login
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Demo Credentials:</p>
          <p>Email: hire-me@anshumat.org</p>
          <p>Password: HireMe@2025!</p>
        </div>
      </div>
    </main>
  )
}
