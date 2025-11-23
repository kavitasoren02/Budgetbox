export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("budgetbox_token")
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("budgetbox_token", token)
}

export function removeToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("budgetbox_token")
}

export function getUser(): { id: string; email: string } | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("budgetbox_user")
  return user ? JSON.parse(user) : null
}

export function setUser(user: { id: string; email: string }): void {
  if (typeof window === "undefined") return
  localStorage.setItem("budgetbox_user", JSON.stringify(user))
}

export function removeUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("budgetbox_user")
}
