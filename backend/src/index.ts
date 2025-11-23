import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import budgetRoutes from "./routes/budget.js"
import { seedDatabase } from "./scripts/seed.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/budgetbox"

// Middleware
app.use(cors())
app.use(express.json())

// Database Connection
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/budget", budgetRoutes)

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.listen(PORT, async() => {
    await seedDatabase();
    console.log(`Server running on port ${PORT}`)
})
