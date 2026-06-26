# Store Rating Platform

A full-stack web application where users can submit ratings for registered stores.

---

## Tech Stack

**Backend:** Node.js, Express.js, Prisma, PostgreSQL (Supabase), JWT, bcrypt, Zod  
**Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router

---

## User Roles

| Role | What They Can Do |
|---|---|
| Admin | Manage users and stores, view platform stats |
| User | Browse stores and submit ratings |
| Store Owner | View their store average rating and raters list |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/store-rating-platform.git
cd store-rating-platform
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your_secret_key_here"
PORT=3000
NODE_ENV=development
```

Run migrations and create the first admin:

```bash
npx prisma migrate dev --name init
npx prisma generate
node scripts/createAdmin.js
npm run dev
```

Backend runs at `http://localhost:3000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Default Admin Login

```
Email:    admin@test.com
Password: Admin@123
```

---

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Register as normal user |
| POST | /api/v1/auth/login | Public | Login |
| POST | /api/v1/users | Admin | Create user with any role |
| GET | /api/v1/users | Admin | Get all users with filters |
| GET | /api/v1/users/:id | Admin | Get user details |
| PATCH | /api/v1/users/update-password | All roles | Update own password |
| POST | /api/v1/stores | Admin | Create store |
| GET | /api/v1/stores | Admin, User | Get all stores |
| GET | /api/v1/stores/:id | User | Get store with own rating |
| POST | /api/v1/ratings | User | Submit rating |
| PATCH | /api/v1/ratings | User | Update existing rating |
| GET | /api/v1/dashboard/admin | Admin | Platform stats |
| GET | /api/v1/dashboard/store-owner | Store Owner | Store stats |

---

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port, default 3000 |
| `NODE_ENV` | development or production |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |