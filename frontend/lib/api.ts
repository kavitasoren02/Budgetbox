const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  } catch (error) {
    throw error
  }
}

export async function registerUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  } catch (error) {
    throw error
  }
}

export async function syncBudget(token: string, budget: any) {
  try {
    const response = await fetch(`${API_BASE}/budget/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budget),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  } catch (error) {
    throw error
  }
}

export async function fetchLatestBudget(token: string) {
  try {
    const response = await fetch(`${API_BASE}/budget/latest`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  } catch (error) {
    throw error
  }
}
