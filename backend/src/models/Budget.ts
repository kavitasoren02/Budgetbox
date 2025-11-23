import mongoose from "mongoose"

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  income: {
    type: Number,
    default: 0,
  },
  categories: {
    bills: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    subscriptions: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 },
  },
  syncStatus: {
    type: String,
    enum: ["local-only", "sync-pending", "synced"],
    default: "synced",
  },
  lastSyncedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Budget", budgetSchema)
