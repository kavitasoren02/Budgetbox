import { openDB } from "idb"

const DB_NAME = "BudgetBoxDB"
const STORE_NAME = "budgets"

export async function initDB() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    },
  })
}

export async function saveBudgetLocal(budget: any) {
  const db = await initDB()
  await db.put(STORE_NAME, {
    id: "current-budget",
    ...budget,
    lastSaved: new Date().toISOString(),
  })
}

export async function getBudgetLocal() {
  const db = await initDB()
  return await db.get(STORE_NAME, "current-budget")
}

export async function clearBudgetLocal() {
  const db = await initDB()
  await db.delete(STORE_NAME, "current-budget")
}
