import mongoose from "mongoose"
import User from "../models/User.js"
import Budget from "../models/Budget.js"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"

dotenv.config()

export const seedDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/budgetbox"
    await mongoose.connect(MONGO_URI)

    // Clear existing data
    await User.deleteMany({})
    await Budget.deleteMany({})

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash("HireMe@2025!", salt)

    // Create demo user
    const demoUser = new User({
      email: "hire-me@anshumat.org",
      password: hashedPassword,
    })
    await demoUser.save()
    console.log("Demo user created:", demoUser.email)

    // Create demo budget
    const demoBudget = new Budget({
      userId: demoUser._id,
      income: 50000,
      categories: {
        bills: 15000,
        food: 8000,
        transport: 3000,
        subscriptions: 1000,
        miscellaneous: 2000,
      },
      syncStatus: "synced",
      lastSyncedAt: new Date(),
    })
    await demoBudget.save()
    console.log("Demo budget created")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Seed error:", error)
  }
}
