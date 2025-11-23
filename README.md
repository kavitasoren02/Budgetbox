# BudgetBox - Offline-First Personal Budgeting App

An offline-first personal budgeting application built with Next.js and Express, following local-first data principles. Works seamlessly offline and syncs data when connection returns.

## Features

✓ **Offline-First Architecture** - Works completely offline with auto-saves to IndexedDB  
✓ **Real-Time Auto-Save** - Every keystroke is instantly saved locally  
✓ **Smart Sync** - Automatic sync when network returns  
✓ **Analytics Dashboard** - Burn rate, savings potential, and month-end predictions  
✓ **Anomaly Detection** - Rule-based spending alerts and insights  
✓ **Category Breakdown** - Pie chart visualization of expenses  
✓ **Multi-Device Support** - Sync across devices when online  

## Tech Stack

### Frontend
- **Next.js** (App Router)
- **TailwindCSS** - Utility-first styling
- **Zustand** - State management
- **IndexedDB** (via IDB) - Local storage
- **Recharts** - Data visualization

### Backend
- **Express.js** - REST API framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

## Project Structure

```
budgetbox/
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── page.tsx          # Login/Register page
│   │   ├── dashboard/        # Protected dashboard
│   │   ├── globals.css       # TailwindCSS v4
│   │   └── layout.tsx
│   ├── components/
│   │   ├── BudgetForm.tsx    # Budget input form
│   │   ├── Dashboard.tsx     # Analytics view
│   │   ├── ExpenseChart.tsx  # Pie chart
│   │   ├── SyncManager.tsx   # Offline sync
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── lib/
│   │   ├── store.ts          # Zustand store
│   │   ├── db.ts             # IndexedDB operations
│   │   ├── api.ts            # API calls
│   │   └── auth.ts           # Auth helpers
│   └── package.json
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── index.ts          # Main server
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Budget.ts
│   │   ├── routes/
│   │   │   ├── auth.ts       # Login/Register
│   │   │   └── budget.ts     # Budget sync endpoints
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT verification
│   │   └── scripts/
│   │       └── seed.ts       # Seed demo user
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Seed demo user**
```bash
npm run seed
```

4. **Start server**
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure API URL** (optional)
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Start development server**
```bash
npm run dev
# App runs on http://localhost:3000
```

## Demo Credentials

```
Email: hire-me@anshumat.org
Password: HireMe@2025!
```

These credentials are pre-filled in the login form for easy testing.

## How to Test Offline Mode

1. **Login** with demo credentials
2. **Go to Edit Budget** tab and add some expenses
3. **Open DevTools** → Network tab
4. **Select "Offline"** from the throttling dropdown
5. **Edit budget** - Changes will save locally
6. **Check sync status** - Shows "Syncing Pending" or "Local Only"
7. **Go back online** - App auto-syncs with server
8. **Pull Latest** - Fetch server version if needed

## Key Components

### BudgetForm
- Auto-saves on every keystroke
- Displays percentage of income for each category
- Real-time validation and feedback

### Dashboard
- **Burn Rate**: Total expenses / monthly income
- **Savings Potential**: Income minus total spending
- **Month-End Prediction**: Linear projection based on current trend
- **Expense Breakdown**: Interactive pie chart
- **Smart Anomalies**: Rule-based spending alerts

### SyncManager
- Online/offline status indicator
- Manual sync button
- Sync status display (Local Only, Syncing, Synced)
- Auto-sync when coming online

## API Endpoints

### Authentication
```
POST /api/auth/register
  Body: { email, password }
  Response: { token, user }

POST /api/auth/login
  Body: { email, password }
  Response: { token, user }
```

### Budget
```
POST /api/budget/sync
  Headers: Authorization: Bearer <token>
  Body: { income, categories }
  Response: { success, timestamp, budget }

GET /api/budget/latest
  Headers: Authorization: Bearer <token>
  Response: { budget }
```

## Offline-First Architecture

### Data Flow
1. **User inputs data** → Zustand store updates
2. **500ms debounce** → Auto-save to IndexedDB
3. **Mark as "sync-pending"** → Ready to sync
4. **Network available** → Auto-send to server
5. **Server acknowledges** → Mark as "synced"

### Sync States
- **local-only**: Never synced with server
- **sync-pending**: Changes waiting to sync
- **synced**: Both local and server are aligned

### Conflict Resolution
- Server always wins on pull
- Client can manually sync/overwrite
- Timestamp comparison for future enhancements

### Backend (Railway/Render)
1. Push to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

## Performance Optimizations

- IndexedDB for instant local caching
- Debounced auto-save (500ms)
- Lazy loading of components
- Optimistic UI updates
- Connection-aware sync

