import type React from "react"
import type { Metadata } from "next"
import './globals.css'

export const metadata: Metadata = {
  title: "BudgetBox - Offline-First Budgeting",
  description: "Personal budgeting app that works offline",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
