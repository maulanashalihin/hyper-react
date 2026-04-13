# HyperReact Boilerplate

> **Modern full-stack React starter with decoupled architecture**

A production-ready boilerplate for building React applications with a **separate backend API**. Features React Router v7 + Vite + TailwindCSS on the frontend, and HyperExpress + Kysely + SQLite on the backend.

[![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat&logo=react)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7.14.0-ca4245?style=flat&logo=react-router)](https://reactrouter.com/)
[![HyperExpress](https://img.shields.io/badge/HyperExpress-v6.17.3-00f0ff?style=flat)](https://github.com/kartikk221/hyper-express)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9.3-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.2.2-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat&logo=docker)](https://www.docker.com/)

---

## ✨ Features

- **⚡️ Decoupled Architecture** - Frontend and backend run independently, deploy separately
- **🚀 High-Performance Backend** - HyperExpress (~7.5x faster than Express.js)
- **🔄 React Router v7** - Modern routing with loaders and data mutations
- **🔐 Complete Authentication** - JWT auth with password reset, email verification, and role-based access control
- **📧 Email System** - Resend integration with terminal simulation mode for development
- **👥 User Management** - 2-tier roles (user | admin) with admin dashboard
- **⚙️ User Settings** - Profile management, password change, account deletion
- **📦 Kysely + SQLite** - Type-safe SQL query builder with file-per-migration system
- **🔒 Zod Validation** - Type-safe form validation on frontend and backend
- **🧪 Test Suite** - 18 tests (12 backend + 6 frontend) with vitest
- **🎨 Beautiful UI** - TailwindCSS + custom UI components (Avatar, Badge, Button, Card, Input, Toast)
- **🐳 Docker-Ready** - Deploy anywhere with Docker
- **📱 Responsive Design** - Mobile-first, production-ready components

---

## 🤔 Why HyperReact?

### The Problem We Solve

| Alternative | Problem |
|-------------|---------|
| **Next.js + Express API** | Over-engineered, heavy bundle, complex setup |
| **React Router Full-Stack** | Tightly coupled, requires Node.js server for frontend |
| **Vite React + Manual Backend** | 2-3 days setup for auth, DB, UI components |

### HyperReact Sweet Spot

✅ **Not too simple** - Production-ready with auth, database, and UI  
✅ **Not too complex** - No SSR overhead, no monolithic deployment  
✅ **Decoupled architecture** - Frontend and backend scale independently  
✅ **Deploy anywhere** - Static hosting for frontend, any Node.js host for backend  
✅ **5-minute setup** - `npm install` and you're ready to code

### Best For

- 🚀 **Startup MVPs** - Launch in days, not weeks
- 📊 **Internal Tools** - Dashboards, admin panels, CRUD apps
- 💼 **SaaS Products** - Multi-user apps with separate API, user management, subscriptions
- 👨‍💻 **Freelance Projects** - Reusable template for client work
- 💬 **Real-time Apps** - Chat, notifications, live updates (WebSocket/SSE supported via HyperExpress)
- 🎓 **Learning Projects** - Production-ready patterns for auth, email, testing, migrations

### When NOT to Use

- 📰 **SEO-heavy content sites** → Use [**laju.dev**](https://laju.dev) (best boilerplate framework), or enable SSR in this stack by setting `ssr: true` in `react-router.config.ts`
- 📄 **Simple static sites** → Use **Astro** (optimized for content sites)
- 🏗️ **Complex enterprise requiring microservices** → Use `backend/` folder only as standalone API service (ignore `app/` folder)

---

## 💪 Scaling Potential

HyperReact can handle **100,000+ RPS** with proper infrastructure:

| Component | Service | Cost/Month |
|-----------|---------|------------|
| **Frontend** | Cloudflare Pages | Free (unlimited bandwidth) |
| **Backend** | Vultr High Frequency | $6-12 |
| **Database** | SQLite WAL + Litestream | ~$5 (replication) |
| **Total** | - | **~$11-17/month** |

With SQLite WAL mode + Litestream replication, you get:
- ✅ High write throughput
- ✅ Point-in-time recovery
- ✅ Cross-region replication
- ✅ Horizontal read scaling

---

## 🔥 Performance Benchmark

### API Layer (HyperExpress)

Tested with `wrk` (4 threads, 100 connections, 30s):

| Framework | Requests/sec | Latency (avg) | Transfer/sec |
|-----------|-------------:|--------------:|-------------:|
| **HyperExpress** | **196,849** | **0.52ms** | **16.33MB** |
| **Express.js** | **26,325** | **4.07ms** | **5.98MB** |
| **Improvement** | **~7.5x faster** | **~8x lower latency** | **~3x throughput** |

HyperExpress delivers **enterprise-grade performance** for your API layer.

### Database Layer (Kysely + better-sqlite3)

Benchmark results from [better-sqlite3-benchmark](https://github.com/maulanashalihin/better-sqlite3-benchmark) (Mac Mini M4 - NVMe Native):

#### WAL Mode Impact (DELETE vs WAL)

| Operation | DELETE Mode | WAL Mode | Improvement |
|-----------|-------------|----------|-------------|
| Single Insert | ~4,496 ops/sec | ~99,437 ops/sec | **22x faster** |
| Batch Insert (5 records) | ~3,507 ops/sec | ~30,655 ops/sec | **9x faster** |
| Select By ID | ~337,456 ops/sec | ~912,229 ops/sec | **2.7x faster** |
| Update Single | ~5,312 ops/sec | ~173,320 ops/sec | **33x faster** |
| Delete Single | ~243,339 ops/sec | ~705,729 ops/sec | **2.9x faster** |
| Concurrent Write | ~5,063 ops/sec | ~64,000 ops/sec | **13x faster** |

> **WAL mode is essential for write-intensive applications.** The performance improvement is dramatic across all write operations.

#### Library Comparison (All in WAL Mode)

| Library | Type Safety | Single Insert | Select By ID | Update | Overhead vs Native |
|---------|-------------|--------------:|-------------:|-------:|-------------------:|
| **Native better-sqlite3** | None | ~99,437 ops/sec | ~912,229 ops/sec | ~173,320 ops/sec | 0% (baseline) |
| **Kysely** | Full TypeScript | ~95,002 ops/sec | ~919,351 ops/sec | ~174,864 ops/sec | **0-5%** |
| **Kysely Generic** | Full TypeScript | ~99,955 ops/sec | ~910,096 ops/sec | ~177,373 ops/sec | **0-5%** |
| **Knex.js** | None (JS only) | ~54,766 ops/sec | ~90,727 ops/sec | ~75,971 ops/sec | **30-50%** |

#### Key Findings

| Category | Winner | Performance | Notes |
|----------|--------|-------------|-------|
| **Single Insert** | Kysely Generic | ~99,955 ops/sec | 22x faster than DELETE mode |
| **Select By ID** | Kysely | ~919,351 ops/sec | 0% overhead (actually faster than native!) |
| **Update** | Kysely Generic | ~177,373 ops/sec | 33x faster than DELETE mode |
| **Concurrent Write** | Native WAL | ~64,000 ops/sec | 13x faster than DELETE mode |

#### Why Kysely + better-sqlite3?

✅ **Near-native performance** - 0-5% overhead vs raw better-sqlite3
✅ **Full TypeScript type-safety** - Catch errors at compile time, not runtime
✅ **WAL mode enabled** - 22-33x faster writes than default DELETE mode
✅ **Type-safe migrations** - File-per-migration system with rollback support
✅ **Clean query builder** - Fluent API, no raw SQL strings needed
✅ **Zero connection pooling overhead** - Perfect for single-file SQLite

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      HyperReact Stack                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐         ┌──────────────────────┐  │
│  │     Frontend        │         │      Backend         │  │
│  │  React Router v7    │◄───────►│   HyperExpress API   │  │
│  │  Vite               │   REST  │   Kysely             │  │
│  │  TailwindCSS        │   JSON  │   SQLite             │  │
│  │  Port: 5173         │         │   Port: 3001         │  │
│  └─────────────────────┘         └──────────────────────┘  │
│                                                             │
│  Development: Separate servers     Production: Static + API │
│  Production:  Static hosting       Deployment: Separate     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Why Decoupled Architecture?

| Benefit | Description |
|---------|-------------|
| 🔒 **Security** | Frontend is static (no server vulnerabilities) |
| 📈 **Scalability** | Scale frontend (CDN) and backend (API) independently |
| 💰 **Cost** | Frontend hosting is free, backend uses minimal resources |
| 🔄 **Flexibility** | Swap frontend/backend without rewriting everything |
| 🚀 **Performance** | Frontend served from edge CDN, backend optimized for API |

---

## 💰 Cost Estimate

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| **Frontend** (Vercel/Netlify) | Free | $0 |
| **Backend** (Railway/Render) | Hobby | $5-10 |
| **Database** (SQLite file) | - | $0 |
| **Total** | - | **~$5-10/month** |

Perfect for side projects and startups! 🎉

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or bun

### First Time Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/hyperreact-boilerplate.git
cd hyperreact-boilerplate

# Install dependencies and run migrations (one-time setup)
npm run setup
```

The `setup` script will:
1. Install all dependencies
2. Run database migrations to create tables
3. Display a success message

### Development

Start both frontend and backend:

```bash
npm run dev
```

This launches:
- **Frontend**: `http://localhost:5173` (Vite dev server with HMR)
- **Backend**: `http://localhost:3001` (HyperExpress API)

### Separate Development

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Database Reset (Development)

Reset database and re-run all migrations:

```bash
npm run refresh
```

This will:
1. Delete the current database
2. Run all migrations to recreate tables
3. Display a success message

### Type Checking

```bash
npm run typecheck
```

### Build for Production

```bash
# Build frontend (outputs to build/client/)
npm run build
```

---

## 📚 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React Router | v7.14.0 | Routing, SSR, data loading with loaders |
| React | v19.2.4 | UI framework |
| Vite | v8.0.3 | Build tool, dev server |
| TailwindCSS | v4.2.2 | Utility-first CSS |
| TypeScript | v5.9.3 | Type safety |
| Lucide React | v1.8.0 | Icon library |

#### Custom UI Components

- **Avatar** - User avatar with gradient fallback and initials
- **Badge** - Status badges with variants (default, success, warning, error, info)
- **Button** - Gradient variants with isLoading support
- **Card** - Composed components (Card, CardHeader, CardTitle, CardContent, CardFooter)
- **Input** - Form input with icon support and error states
- **Toast** - Custom toast notifications with auto-dismiss and icons

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| HyperExpress | v6.17.3 | High-performance web framework (7.5x faster than Express) |
| Kysely | v0.28.16 | Type-safe SQL query builder |
| kysely-generic-sqlite | v1.2.1 | Kysely dialect for better-sqlite3 |
| better-sqlite3 | v12.8.0 | SQLite database driver |
| bcrypt | v6.0.0 | Password hashing |
| jsonwebtoken | v9.0.3 | JWT authentication |
| dotenv | v17.4.1 | Environment variables |

#### Why HyperExpress?

| Framework | Requests/sec | Latency |
|-----------|-------------:|--------:|
| HyperExpress | ~197,000 | ~0.5ms |
| Fastify | ~100,000 | ~1ms |
| Express.js | ~26,000 | ~4ms |
| NestJS | ~20,000 | ~5ms |

*Tested with `wrk` (4 threads, 100 connections, 30s) on Apple M1*

---

## 📁 Project Structure

```
hyperreact-boilerplate/
├── app/                          # Frontend React application
│   ├── components/
│   │   ├── layout/
│   │   │   └── header.tsx        # Global header with navigation & theme toggle
│   │   └── ui/                   # Custom UI components
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── toast.tsx
│   ├── contexts/
│   │   ├── auth.context.tsx      # Auth state provider
│   │   └── theme.context.tsx     # Dark/light theme provider
│   ├── hooks/
│   │   └── use-auth.ts           # Auth hook
│   ├── lib/
│   │   ├── api.ts                # Fetch API client
│   │   ├── types.ts              # TypeScript types
│   │   ├── validation.ts         # Zod validation schemas (shared)
│   │   └── utils.ts              # Utility functions
│   ├── routes/
│   │   ├── _index.tsx            # Home page (/) - redirects to dashboard/login
│   │   ├── auth/
│   │   │   ├── login.tsx         # Login page (/auth/login)
│   │   │   ├── register.tsx      # Register page (/auth/register)
│   │   │   ├── forgot-password.tsx  # Password reset request
│   │   │   ├── reset-password.tsx   # Password reset form
│   │   │   └── verify-email.tsx     # Email verification page
│   │   ├── dashboard/
│   │   │   ├── _index.tsx        # Dashboard (/dashboard)
│   │   │   └── users.tsx         # Users management (/dashboard/users)
│   │   ├── settings/
│   │   │   ├── profile.tsx       # Profile settings (/settings/profile)
│   │   │   └── security.tsx      # Password change (/settings/security)
│   │   └── admin/
│   │       └── users.tsx         # Admin user management (/admin/users)
│   ├── tests/                    # Frontend tests (vitest)
│   │   ├── auth.test.tsx
│   │   ├── settings.test.tsx
│   │   ├── routing.test.tsx
│   │   └── setup.ts
│   ├── app.css                   # Global styles
│   ├── root.tsx                  # Root layout
│   └── routes.ts                 # Route configuration
│
├── backend/                      # Backend API server
│   ├── config/
│   │   └── env.ts                # Environment config
│   ├── database/
│   │   ├── index.ts              # Kysely instance + better-sqlite3 connection
│   │   ├── types.ts              # Database type definitions
│   │   └── migration-runner.ts   # Kysely Migrator + FileMigrationProvider
│   ├── dto/                      # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── migrations/               # Kysely migrations (file-per-migration)
│   │   └── 0001_initial_schema.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT validation
│   │   ├── role.middleware.ts    # Role-based access control
│   │   └── error.middleware.ts   # Error handler
│   ├── routes/
│   │   ├── auth.route.ts         # /api/auth/* endpoints
│   │   ├── users.route.ts        # /api/users/* endpoints
│   │   └── admin.route.ts        # /api/admin/* endpoints (admin only)
│   ├── services/
│   │   ├── auth.service.ts       # Auth business logic
│   │   ├── users.service.ts      # Users CRUD logic
│   │   └── email.service.ts      # Email sending (Resend + simulation)
│   ├── validators/
│   │   └── auth.validator.ts     # Zod schemas for auth
│   ├── tests/                    # Backend tests (vitest)
│   │   ├── auth.test.ts
│   │   ├── users.test.ts
│   │   ├── email.test.ts
│   │   └── middleware.test.ts
│   ├── migrations/               # Kysely migrations (file-per-migration)
│   ├── .env                      # Backend environment
│   ├── index.ts                  # HyperExpress entry point
│   └── database.sqlite           # SQLite database (git-ignored)
│
├── public/                       # Static assets
├── .env                          # Frontend environment
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
├── vitest.workspace.ts           # Vitest workspace config
└── tsconfig.json
```

---

## 🔌 API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Request password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/resend-verification` | Resend verification email |
| GET | `/api/auth/me` | Get current user (protected) |

### Users (Protected - requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user (profile, email) |
| DELETE | `/api/users/:id` | Delete user account |
| POST | `/api/users/change-password` | Change password |

### Admin (Protected - requires admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (admin only) |
| PATCH | `/api/admin/users/:id/role` | Change user role (admin only) |
| DELETE | `/api/admin/users/:id` | Delete user (admin only) |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

---

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register` → returns `{ user, token }`
   - Email verification token sent (via email or terminal simulation)
   - User created with `role: 'user'` by default
2. **Verify Email**: `POST /api/auth/verify-email` with token → sets `emailVerified: true`
3. **Login**: `POST /api/auth/login` → returns `{ user, token }`
   - Token includes `userId`, `username`, `email`, `role`
4. **Token Storage**: Frontend stores token in `localStorage`
5. **Protected Requests**: Token sent via `Authorization: Bearer <token>` header
6. **Token Validation**: Backend validates JWT using auth middleware
7. **Role-Based Access**: Admin routes require `role: 'admin'` in token
8. **Auto-redirect**: Frontend redirects to `/auth/login` on 401/403

### Password Reset Flow

1. **Request Reset**: `POST /api/auth/forgot-password` with email
   - Reset token sent via email (expires in 1 hour)
2. **Reset Password**: `POST /api/auth/reset-password` with token + new password
3. **Login**: User can now login with new password

### Email Verification Flow

1. **Register**: Verification token sent automatically
2. **Verify**: `POST /api/auth/verify-email` with token from email
3. **Resend**: `POST /api/auth/resend-verification` if email not received (rate-limited: 3/hour)

---

## 🌍 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
DATABASE_PATH=database.sqlite
RESEND_API_KEY=your-resend-api-key  # Optional - omit for terminal simulation mode
```

**Email Simulation Mode**: If `RESEND_API_KEY` is not set, emails are displayed in the terminal with nice formatting instead of being sent. Perfect for development!

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Build image
docker build -t hyperreact-app .

# Run container
docker run -p 3000:3000 hyperreact-app
```

### Deploy to Cloud

The Docker container can be deployed to:

- **AWS ECS** - Elastic Container Service
- **Google Cloud Run** - Serverless containers
- **Azure Container Apps** - Managed containers
- **DigitalOcean App Platform** - Simple deployment
- **Fly.io** - Edge deployment
- **Railway** - One-click deployment

---

## 🚢 Production Deployment

### Frontend (Static Hosting)

```bash
npm run build
# Deploy build/client/ to:
# - Vercel
# - Netlify
# - Cloudflare Pages
# - AWS S3 + CloudFront
```

### Backend (Node.js Server)

Deploy the `backend/` folder to any Node.js hosting:

- **Railway** - Simple Node.js hosting
- **Render** - Free tier available
- **Fly.io** - Edge deployment
- **AWS Lambda** - Serverless (with adapter)
- **DigitalOcean App Platform**

Set production environment variables:
- `NODE_ENV=production`
- `JWT_SECRET=<secure-random-string>`

---

## 🛠️ Common Tasks

### Add a New API Endpoint

1. Add route handler in `backend/routes/*.route.ts`
2. Add service method in `backend/services/*.service.ts` if needed
3. Add Zod validator in `backend/validators/*.ts` if needed
4. Update frontend API client in `app/lib/api.ts`
5. Add test in `backend/tests/*.test.ts`

### Add a New Page with Data Loading

1. Create route component in `app/routes/`
2. Add `clientLoader` export for data fetching (runs before render)
3. Use `useLoaderData()` to access data in component
4. Add route config in `app/routes.ts`
5. Add navigation link in `app/components/layout/header.tsx`
6. Add test in `app/tests/*.test.tsx`

### Database Changes

1. Add migration file in `backend/migrations/NNNN_name.ts` (export `up` and `down` functions)
2. Run migration: `npm run migration:run`
3. Test rollback: `npm run migration:revert`

### Add Zod Validation

1. Add schema in `backend/validators/*.ts` or `app/lib/validation.ts`
2. Use `.safeParse()` in route handlers
3. Return 400 with `{ error, field }` on validation failure

### Add Role-Based Access

1. Import `requireRole` middleware from `backend/middleware/role.middleware.ts`
2. Apply to route: `router.get('/admin', requireRole(['admin']), handler)`
3. Frontend: Check `user.role` from auth context to show/hide admin links

### Test Your Code

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run with coverage
npm run test:coverage
```

---

## 🔧 Troubleshooting

### Double API Requests on Route Load

- **Cause**: Using `useEffect` for data fetching (fires twice in React 18+ Strict Mode)
- **Solution**: Use React Router v7 `clientLoader` instead of `useEffect`

### CORS Errors

- Ensure backend CORS middleware allows frontend origin
- Check preflight OPTIONS handling

### JWT Issues

- Verify `JWT_SECRET` is set in backend `.env`
- Check token format: `Authorization: Bearer <token>`
- Token includes: `userId`, `username`, `email`, `role`

### Database Errors

- **First time setup**: Run `npm run setup` to install dependencies and migrate database
- **Reset database**: Run `npm run refresh` to delete and recreate database (development only)
- **Manual migration**: Run `npm run migration:run` if tables are missing

### Email Not Sending

- **Development**: Check terminal for simulation output (emails shown in console)
- **Production**: Set `RESEND_API_KEY` in `backend/.env`
- **Verification**: Check Resend dashboard for sent emails

### Role-Based Access Issues

- Verify user has `role: 'admin'` in database
- Login again after role change (JWT must include new role)
- Check `requireRole(['admin'])` middleware is applied to route

### Tests Failing

- Backend tests use in-memory SQLite database
- Frontend tests mock API calls (no backend needed)
- Run `npm run test:backend` and `npm run test:frontend` separately to isolate issues

### Migration Errors

- Run migrations: `npm run migration:run`
- Revert last migration: `npm run migration:revert`
- Create new migration: add file `backend/migrations/NNNN_name.ts` with `up` and `down` exports

---

## 📖 Documentation

### Core Technologies

- [React Router v7](https://reactrouter.com/) - Modern routing with loaders and mutations
- [HyperExpress](https://github.com/kartikk221/hyper-express) - High-performance Node.js framework
- [Kysely](https://kysely.dev/) - Type-safe SQL query builder with migrations
- [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Icon library
- [Zod](https://zod.dev/) - TypeScript-first validation
- [vitest](https://vitest.dev/) - Fast unit test framework
- [Resend](https://resend.com/) - Email API (with simulation mode)

### Features Documentation

- **Authentication**: JWT-based with password reset and email verification
- **Authorization**: Role-based access control (user | admin)
- **Email**: Resend integration with terminal simulation for development
- **Database**: Kysely with SQLite and file-per-migration system
- **Testing**: vitest workspace with backend (12 tests) + frontend (6 tests)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this boilerplate for your projects.

---

## 🙏 Acknowledgments

Built with ❤️ using **HyperReact** stack.

- [React Router](https://reactrouter.com/) - Modern web framework for React
- [HyperExpress](https://github.com/kartikk221/hyper-express) - High-performance Node.js framework
- [Kysely](https://kysely.dev/) - Type-safe SQL query builder
- [Lucide React](https://lucide.dev/) - Beautiful icon library

---

**Happy Coding! 🚀**
