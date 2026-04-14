# SpendSmart — Premium Finance Dashboard

A full-stack personal finance dashboard built with **React + Tailwind CSS v4** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS v4, Recharts, React Router v7 |
| Backend | Node.js, Express 4, MongoDB Atlas, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Deploy | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
spendsmart-finance/
├── src/                   # React frontend
│   ├── api/               # Fetch-based API client
│   ├── components/        # Shared UI components
│   ├── context/           # Global state (AppContext)
│   ├── pages/             # Route-level page components
│   └── utils/             # Category config, helpers
├── server/                # Express API backend
│   ├── config/            # DB connection
│   ├── controllers/       # Route handlers
│   ├── middleware/         # Auth, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   └── utils/             # JWT helpers
├── vercel.json            # Vercel deployment config
├── render.yaml            # Render deployment config
└── .env.example           # Frontend env template
```

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/your-username/spendsmart-finance.git
cd spendsmart-finance

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure environment variables

```bash
# Frontend
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:5000/api

# Backend
cp server/.env.example server/.env
# Fill in MONGODB_URI, JWT_SECRET
```

### 3. Run both servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. [dashboard.render.com](https://dashboard.render.com) → **New Web Service** → connect repo
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm ci --omit=dev`
   - **Start Command:** `node server.js`
4. Add **Environment Variables** in Render dashboard:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | A secure random string (64+ chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `https://your-app.vercel.app` |

### Frontend → Vercel

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. Framework auto-detected as **Vite**
3. Add **Environment Variable** in Vercel dashboard:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://spendsmart-api.onrender.com/api` |

4. Deploy — done ✅

> After both are live, update `CLIENT_URL` on Render to your Vercel URL.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/transactions` | ✅ | List transactions |
| POST | `/api/transactions` | ✅ | Create transaction |
| PUT | `/api/transactions/:id` | ✅ | Update transaction |
| DELETE | `/api/transactions/:id` | ✅ | Delete transaction |
| GET | `/api/dashboard` | ✅ | Summary + recent |
| GET | `/api/analytics/advanced` | ✅ Pro | Advanced analytics |
| GET | `/api/export` | ✅ Pro | Export CSV/JSON |
| GET | `/api/health` | ❌ | Health check |

---

## Grant Pro Access

Via MongoDB Atlas → Browse Collections → `users` collection:

```js
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isPro: true } }
)
```
