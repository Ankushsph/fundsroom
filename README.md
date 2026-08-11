# Fundsroom Mini ERP + CRM Operations Portal

A full-stack ERP/CRM system for wholesale/distribution companies, built with Node.js, TypeScript, Express, React, and PostgreSQL.

## Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local or cloud)

### Setup

1. **Clone and install backend dependencies**
   ```bash
   git clone https://github.com/Ankushsph/fundsroom.git
   cd fundsroom/backend
   npm install
   ```

2. **Configure database**
   
   Create a PostgreSQL database and update `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fundsroom_erp?schema=public"
   JWT_SECRET="your-secret-key"
   ```
   
   For quick setup, use free PostgreSQL from:
   - [Supabase](https://supabase.com) 
   - [Neon](https://neon.tech)
   - [Render](https://render.com)

3. **Run migrations and seed**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   
   API available at `http://localhost:5000`

5. **Setup frontend** (in another terminal)
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   
   Frontend available at `http://localhost:5173`

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@fundsroom.com | Admin@123 |
| SALES | sales@fundsroom.com | Sales@123 |
| WAREHOUSE | warehouse@fundsroom.com | Warehouse@123 |
| ACCOUNTS | accounts@fundsroom.com | Accounts@123 |

## Database Schema

- **User** - Authentication with role-based access (ADMIN, SALES, WAREHOUSE, ACCOUNTS)
- **Customer** - Customer information with soft delete
- **CustomerNote** - Follow-up notes
- **Product** - Product catalog with soft delete
- **StockMovement** - Inventory audit trail (IN/OUT)
- **SalesChallan** - Sales orders (DRAFT/CONFIRMED/CANCELLED)
- **ChallanItem** - Historical product snapshots in orders

## Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npx prisma studio    # Open database GUI
npx prisma validate  # Validate schema
```

## License

ISC
