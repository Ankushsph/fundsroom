# Fundsroom Mini ERP + CRM Operations Portal

A full-stack ERP/CRM system for wholesale/distribution companies, built with Node.js, TypeScript, Express, React, and PostgreSQL.

## Architecture

```
frontend/ (React + Vite + Tailwind)
    ↓ REST / JWT
backend/ (Express + Prisma + Zod)
    ↓
PostgreSQL
```

**Modules:** Authentication & RBAC, Customer CRM, Products, Inventory (stock IN/OUT), Sales Challans with atomic confirmation.

**Roles:**
| Role | Permissions |
|------|-------------|
| ADMIN | Full access |
| SALES | Customers (CRUD), Challans (CRUD/confirm/cancel), read products/inventory |
| WAREHOUSE | Products (CRUD), Inventory (stock IN/OUT), read customers |
| ACCOUNTS | Read-only access to customers, products, inventory, challans |

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local, Neon, Supabase, or Render Postgres)

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit with your values
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

API runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing JWTs (use a long random string in production) | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Test Credentials (development only)

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@fundsroom.com | Admin@123 |
| SALES | sales@fundsroom.com | Sales@123 |
| WAREHOUSE | warehouse@fundsroom.com | Warehouse@123 |
| ACCOUNTS | accounts@fundsroom.com | Accounts@123 |

## Build & Production

### Backend

```bash
cd backend
npm run build          # compiles to dist/
npm start              # runs dist/server.js
```

On deploy, run migrations before starting:

```bash
npx prisma migrate deploy
```

### Frontend

```bash
cd frontend
npm run build          # outputs to dist/
npm run preview        # local preview of production build
```

Set `VITE_API_URL` to your deployed backend URL (e.g. `https://api.example.com/api`) before building.

## Deployment to Render

### Option A: 1-Click Render Blueprint (Recommended)

1. Push your repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository. Render will automatically detect `render.yaml` and configure:
   - **PostgreSQL Database** (`fundsroom-db`)
   - **Backend Web Service** (`fundsroom-backend`)
   - **Frontend Static Site** (`fundsroom-frontend`)
5. Click **Apply**. Render will automatically provision the database, build the backend, run Prisma database migrations (`npx prisma migrate deploy`), build the React frontend, and cross-link all environment variables (`DATABASE_URL`, `CORS_ORIGIN`, `VITE_API_URL`, `JWT_SECRET`).
6. *(Optional)* Seed production database with initial users:
   Go to **fundsroom-backend** on Render -> **Shell** tab -> run:
   ```bash
   npx prisma db seed
   ```

---

### Option B: Manual Setup on Render

#### 1. PostgreSQL Database
1. On Render, create a **New PostgreSQL** instance (`fundsroom-db`).
2. Copy the **Internal Database URL** or **External Database URL**.

#### 2. Backend Web Service
1. Create a **New Web Service** connected to your repo.
2. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm start`
   - **Health Check Path**: `/api/health`
3. Environment Variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = *(Your Render/Neon PostgreSQL connection string)*
   - `JWT_SECRET` = *(A long random secret string)*
   - `CORS_ORIGIN` = *(Your Render frontend URL, e.g. `https://fundsroom-frontend.onrender.com`)*
   - `JWT_EXPIRES_IN` = `7d`

#### 3. Frontend Static Site
1. Create a **New Static Site** connected to your repo.
2. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
4. Redirects / Rewrites:
   - Add rewrite rule: `/*` -> `/index.html` (Status `200`) for SPA routing.

---

## Key Business Rules

- Challans start as **DRAFT**; stock is deducted only on **confirmation**
- Confirmation uses a **serializable transaction** with conditional SQL to prevent negative stock and race conditions
- Cancelling a **CONFIRMED** challan restores stock and creates IN movements
- Product snapshots (name, SKU, price) are stored on challan items for historical accuracy
- Customer delete is a **soft delete** (`isDeleted = true`)
- Product delete is a **soft deactivate** (`isActive = false`)

## Development Commands

```bash
# Backend
npm run dev              # dev server with hot reload
npx prisma validate      # validate schema
npx prisma studio        # database GUI

# Frontend
npm run dev              # Vite dev server
npm run lint             # TypeScript check
```

## API Overview

| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/api/auth/login` | Public | — |
| GET | `/api/auth/me` | JWT | All |
| GET/POST/PUT/DELETE | `/api/customers` | JWT | See RBAC |
| GET/POST/PUT/DELETE | `/api/products` | JWT | See RBAC |
| POST | `/api/inventory/stock-in` | JWT | ADMIN, WAREHOUSE |
| POST | `/api/inventory/stock-out` | JWT | ADMIN, WAREHOUSE |
| GET | `/api/inventory/movements` | JWT | All |
| GET/POST/PUT | `/api/challans` | JWT | ADMIN, SALES |
| POST | `/api/challans/:id/confirm` | JWT | ADMIN, SALES |
| POST | `/api/challans/:id/cancel` | JWT | ADMIN, SALES |
| GET | `/api/health` | Public | — |

## Known Limitations

- No refresh tokens (JWT expires per `JWT_EXPIRES_IN`)
- No PDF invoice export
- No product image upload
- Dashboard stats require separate paginated API calls

## License

ISC
