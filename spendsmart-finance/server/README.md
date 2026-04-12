# SpendSmart API

Production-ready REST API for the SpendSmart Finance Dashboard.
Built with **Node.js + Express + MongoDB (Mongoose)**.

---

## Quick Start

```bash
# 1. Install dependencies
cd server
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET

# 3. Start dev server
npm run dev
# → API running at http://localhost:5000
```

---

## Project Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Signup, Login, Me
│   ├── transactionController.js  # CRUD (userId-scoped)
│   ├── dashboardController.js # Aggregated summaries
│   ├── exportController.js    # JSON / CSV export
│   └── analyticsController.js # Advanced analytics (Pro)
├── middleware/
│   ├── authMiddleware.js      # JWT verification → req.user
│   ├── proMiddleware.js       # isPro gate → 403 on free tier
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js                # name, email, password (hashed), isPro
│   └── Transaction.js         # userId, title, amount, type, category, date
├── routes/
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   ├── dashboardRoutes.js
│   ├── exportRoutes.js
│   └── analyticsRoutes.js
├── utils/
│   ├── responseHelper.js      # sendSuccess / sendError / AppError
│   └── validators.js          # express-validator chains
├── .env.example
├── .gitignore
├── package.json
└── server.js                  # Entry point
```

---

## API Reference

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | None | Server status check |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | None | Register new user |
| POST | `/api/auth/login`  | None | Login, returns JWT |
| GET  | `/api/auth/me`     | JWT  | Get current user profile |
| PUT  | `/api/auth/me`     | JWT  | Update name / avatar |
| DELETE | `/api/auth/me`   | JWT  | Soft-delete account |

**Signup body:**
```json
{ "name": "Alex Mercer", "email": "alex@example.com", "password": "secret123" }
```

**Login response:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Alex", "email": "...", "isPro": false },
    "token": "eyJ...",
    "expiresIn": "7d"
  }
}
```

---

### Transactions
All endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/transactions` | List with filter + pagination |
| POST   | `/api/transactions` | Create transaction |
| GET    | `/api/transactions/:id` | Get single |
| PUT    | `/api/transactions/:id` | Update (owner only) |
| DELETE | `/api/transactions/:id` | Delete (owner only) |

**Query params for GET list:**
```
?type=income|expense
&category=Food+%26+Groceries
&startDate=2024-01-01
&endDate=2024-12-31
&page=1
&limit=20
&sortBy=date|amount|title
&order=asc|desc
```

**Create/Update body:**
```json
{
  "title": "Netflix",
  "amount": 15.99,
  "type": "expense",
  "category": "Entertainment",
  "date": "2024-06-01",
  "method": "VISA •••• 4242",
  "notes": "Monthly subscription"
}
```

---

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | JWT | Full summary + charts data |

**Response includes:**
- `balance`, `income`, `expense`, `transactionCount`, `savingsRate`
- `categoryBreakdown[]` — expenses by category with %
- `monthlyCashFlow[]` — last 6 months income vs expenses
- `recentTransactions[]` — last 5

---

### Export _(Pro users only)_
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/export?format=json` | JWT + Pro | Download JSON |
| GET | `/api/export?format=csv`  | JWT + Pro | Download CSV |

Supports same date/type/category filters as transactions.

---

### Advanced Analytics _(Pro users only)_
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/advanced?year=2024` | JWT + Pro | Deep analytics |

**Response includes:**
- `monthlyBreakdown[]` — all 12 months (zero-filled)
- `topCategories[]` — top 5 expense categories all-time
- `weeklyTrend[]` — last 8 weeks spending
- `avgDailySpend` — current month average
- `incomeSources[]` — income category breakdown

---

## Response Format

Every response follows a consistent envelope:

```json
{
  "success": true | false,
  "message": "Human readable message",
  "timestamp": "2024-06-01T12:00:00.000Z",
  "data": { ... }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Email is already in use",
  "timestamp": "...",
  "errors": [
    { "field": "email", "message": "Email is already in use" }
  ]
}
```

---

## Authentication Flow

```
1. POST /api/auth/signup  →  { user, token }
2. Store token in localStorage as 'ss-auth-token'
3. All protected requests: Authorization: Bearer <token>
4. Token expiry: 7d (configurable via JWT_EXPIRES_IN)
```

---

## Feature Gating (Pro)

To enable Pro features for a user, set `isPro: true` in MongoDB:
```js
db.users.updateOne({ email: "alex@example.com" }, { $set: { isPro: true } })
```

Free users hitting `/api/export` or `/api/analytics/advanced` receive:
```json
{ "success": false, "message": "This feature requires a SpendSmart Pro subscription.", "status": 403 }
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Environment |
| `MONGODB_URI` | — | MongoDB connection string |
| `JWT_SECRET` | — | JWT signing secret (keep long + random) |
| `JWT_EXPIRES_IN` | 7d | Token expiry |
| `CLIENT_URL` | http://localhost:5173 | Frontend CORS origin |

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error / bad input |
| 401 | Missing or invalid JWT |
| 403 | Pro feature — upgrade required |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 413 | Request body too large |
| 500 | Internal server error |

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Database:** MongoDB 7+ via Mongoose 8
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator
- **CORS:** cors middleware
- **Dev:** nodemon
