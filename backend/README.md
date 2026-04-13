# Backend - HyperExpress + TypeORM

Backend API untuk React SPA dengan HyperExpress server dan TypeORM (better-sqlite3).

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Copy `.env.example` ke `.env` dan sesuaikan:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npx tsx index.ts
```

Server akan berjalan di `http://localhost:3001`

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.ts       # TypeORM DataSource
│   └── env.ts            # Environment config
├── dto/
│   ├── login.dto.ts      # Login request type
│   └── register.dto.ts   # Register request type
├── entities/
│   └── user.entity.ts    # User entity
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── routes/
│   ├── auth.route.ts     # /api/auth/*
│   └── users.route.ts    # /api/users/*
├── services/
│   ├── auth.service.ts
│   └── users.service.ts
├── migrations/           # TypeORM migrations
├── .env                  # Environment variables
├── .env.example
└── index.ts              # Entry point
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/register` | Register | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | ✅ |
| GET | `/api/users/:id` | Get user by ID | ✅ |
| PUT | `/api/users/:id` | Update user | ✅ |
| DELETE | `/api/users/:id` | Delete user | ✅ |

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

---

## 🔐 Environment Variables

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
DATABASE_PATH=database.sqlite
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** HyperExpress
- **ORM:** TypeORM
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT (jsonwebtoken)
- **Password:** bcrypt
