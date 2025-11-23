import express, { type Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import type { AuthRequest } from "../middleware/auth.js"
import bcryptjs from "bcryptjs"

const router = express.Router()

router.post("/register", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const user = new User({ email, password: hashedPassword })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ error: "Registration failed" })
  }
})

router.post("/login", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ error: "Login failed" })
  }
})

export default router
