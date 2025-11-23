import express, { type Response } from "express"
import { authenticate, type AuthRequest } from "../middleware/auth.js"
import Budget from "../models/Budget.js"

const router = express.Router()

// POST /api/budget/sync - Push local data to server
router.post("/sync", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { income, categories } = req.body
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    let budget = await Budget.findOne({ userId })

    if (!budget) {
      budget = new Budget({
        userId,
        income,
        categories,
        syncStatus: "synced",
        lastSyncedAt: new Date(),
      })
    } else {
      budget.income = income
      budget.categories = categories
      budget.syncStatus = "synced"
      budget.lastSyncedAt = new Date()
      budget.updatedAt = new Date()
    }

    await budget.save()

    res.json({
      success: true,
      timestamp: budget.lastSyncedAt,
      budget: {
        id: budget._id,
        income: budget.income,
        categories: budget.categories,
        syncStatus: "synced",
      },
    })
  } catch (error) {
    console.error("Sync error:", error)
    res.status(500).json({ error: "Sync failed" })
  }
})

// GET /api/budget/latest - Fetch last saved version
router.get("/latest", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const budget = await Budget.findOne({ userId })

    if (!budget) {
      return res.json({
        budget: {
          income: 0,
          categories: {
            bills: 0,
            food: 0,
            transport: 0,
            subscriptions: 0,
            miscellaneous: 0,
          },
          syncStatus: "local-only",
        },
      })
    }

    res.json({
      budget: {
        id: budget._id,
        income: budget.income,
        categories: budget.categories,
        syncStatus: budget.syncStatus,
        lastSyncedAt: budget.lastSyncedAt,
      },
    })
  } catch (error) {
    console.error("Fetch error:", error)
    res.status(500).json({ error: "Failed to fetch budget" })
  }
})

export default router
