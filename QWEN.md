# HyperReact v2 - Project Context

## Project Overview

**HyperReact v2** is a modern full-stack React boilerplate with a **decoupled architecture**:
- **Frontend**: React 19 + React Router v7 + Vite + TailwindCSS v4 (SPA, client-side rendered)
- **Backend**: HyperExpress + Kysely + better-sqlite3 (REST API)
- **Database**: SQLite with type-safe queries via Kysely
- **Auth**: JWT-based authentication with role-based access control (user | admin)

### Key Features
- Complete authentication flow (login, register, password reset, email verification)
- Role-based access control (user | admin)
- Email system with Resend integration + terminal simulation mode
- Type-safe form validation with Zod
- Test suite with vitest (frontend + backend)
- Custom UI components (Avatar, Badge, Button, Card, Input, Toast)
- Docker-ready deployment

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | React | 19.2.4 |
| **Routing** | React Router | v7.14.0 |
| **Build Tool** | Vite | v8.0.3 |
| **Styling** | TailwindCSS | v4.2.2 |
| **Language** | TypeScript | v5.9.3 |
| **Backend Framework** | HyperExpress | v6.17.3 |
| **Query Builder** | Kysely | v0.28.16 |
| **Database** | better-sqlite3 | v12.8.0 |
| **Auth** | jsonwebtoken + bcrypt | v9.0.3 + v6.0.0 |
| **Validation** | Zod | v4.3.6 |
| **Testing** | vitest | v4.1.4 |
| **Email** | Resend | v6.10.0 |

---

## Development Commands

```bash
# First-time setup (install deps + run migrations)
npm run setup

# Development (runs both frontend + backend)
npm run dev

# Frontend only (port 5173)
npm run dev:frontend

# Backend only (port 3001)
npm run dev:backend

# Reset database (delete + re-migrate)
npm run refresh

# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Type check
npm run typecheck

# Build for production
npm run build
```

---

## Project Structure

```
hyper-react-v2/
├── app/                          # Frontend React application
│   ├── components/
│   │   ├── layout/
│   │   │   └── header.tsx        # Global header with navigation
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
│   │   ├── validation.ts         # Zod validation schemas
│   │   └── utils.ts              # Utility functions (cn)
│   ├── routes/
│   │   ├── _index.tsx            # Home page
│   │   ├── auth/                 # Login, register, password reset
│   │   ├── dashboard/            # Dashboard pages
│   │   ├── settings/             # Profile, security settings
│   │   └── admin/                # Admin-only pages
│   ├── tests/                    # Frontend tests
│   ├── app.css                   # Global styles
│   ├── root.tsx                  # Root layout
│   └── routes.ts                 # Route configuration
│
├── backend/                      # Backend API server
│   ├── config/
│   │   └── env.ts                # Environment config
│   ├── database/
│   │   ├── index.ts              # Kysely database setup
│   │   ├── migration-runner.ts   # Migration executor
│   │   └── types.ts              # Database types (Kysely)
│   ├── dto/                      # Data Transfer Objects
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT validation
│   │   └── error.middleware.ts   # Error handler
│   ├── migrations/               # Kysely migrations
│   ├── routes/
│   │   ├── auth.route.ts         # /api/auth/* endpoints
│   │   ├── users.route.ts        # /api/users/* endpoints
│   │   └── admin.route.ts        # /api/admin/* endpoints
│   ├── services/
│   │   ├── auth.service.ts       # Auth business logic
│   │   ├── users.service.ts      # Users CRUD logic
│   │   └── email.service.ts      # Email sending (Resend)
│   ├── tests/                    # Backend tests
│   ├── validators/
│   │   └── auth.validator.ts     # Zod schemas for auth
│   ├── .env                      # Backend environment
│   └── index.ts                  # HyperExpress entry point
│
├── data/                         # SQLite database storage
├── public/                       # Static assets
├── .env                          # Frontend environment
├── .env.example
├── Dockerfile
├── package.json
├── react-router.config.ts        # React Router config (ssr: false)
├── tsconfig.json
├── vite.config.ts
└── vitest.workspace.ts           # Vitest workspace config
```

---

## Environment Variables

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
RESEND_API_KEY=your-api-key-here  # Optional - terminal simulation if omitted
```

**Email Simulation Mode**: If `RESEND_API_KEY` is not set, emails are printed to the terminal with nice formatting instead of being sent.

---

## API Endpoints

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

## HyperExpress-Specific Guidelines

### Response Methods
```javascript
// Use these methods (NOT writeStatus)
res.send('text')
res.json({ data })
res.html('<html>')
res.redirect('/path')
res.status(404).json({ error: 'Not found' })
```

### Middleware Pattern
```javascript
// Middleware must be synchronous OR handle async properly
// Always call next() exactly once
server.use((req, res, next) => {
  // Do something
  next(); // Call next() only once
});

// For async middleware, handle the async inside
server.use(async (req, res, next) => {
  await someAsyncOperation();
  next(); // Still call next() once
});
```

### Router Usage
```javascript
import HyperExpress from 'hyper-express';

const router = new HyperExpress.Router();
router.use('/prefix', anotherRouter);
router.get('/path', handler);
router.post('/path', handler);

server.use('/api', router);
```

### Request Body Parsing
```javascript
// After JSON middleware or for JSON bodies
const body = await req.json();
const text = await req.text();
const formData = await req.formData();

// Access params and query
const id = req.params.id;
const search = req.query.search;
const authHeader = req.headers['authorization'];
```

---

## Frontend Patterns

### API Client (`app/lib/api.ts`)
```typescript
// Use the request helper for all API calls
const { user, token } = await authApi.login(username, password);
const { users } = await usersApi.getAll(token);

// The request helper:
// - Adds Content-Type: application/json header
// - Adds Authorization: Bearer <token> if provided
// - Handles 401 by redirecting to /auth/login (for non-auth endpoints)
// - Parses JSON response
```

### Auth Context
```typescript
import { useAuth } from '~/contexts/auth.context';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state in components
}
```

### Route Configuration (`app/routes.ts`)
```typescript
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("auth/login", "routes/auth/login.tsx"),
  route("dashboard", "routes/dashboard/_index.tsx"),
] satisfies RouteConfig;
```

### Data Loading (React Router v7)
```typescript
// Use clientLoader for data fetching (runs before render)
export async function clientLoader() {
  const token = localStorage.getItem('token');
  const { users } = await fetchUsers(token);
  return { users };
}

// Access data in component
import { useLoaderData } from 'react-router';

function Dashboard() {
  const { users } = useLoaderData();
  return <div>{/* render users */}</div>;
}
```

---

## Backend Patterns

### Kysely Database Queries
```typescript
import { db } from '../database/index.js';

// Select
const user = await db
  .selectFrom('users')
  .selectAll()
  .where('username', '=', username)
  .executeTakeFirst();

// Insert
const newUser = await db
  .insertInto('users')
  .values({ id, username, email, password: hashedPassword })
  .returningAll()
  .executeTakeFirstOrThrow();

// Update
await db
  .updateTable('users')
  .set({ emailVerified: true })
  .where('id', '=', userId)
  .execute();

// Delete
await db
  .deleteFrom('users')
  .where('id', '=', userId)
  .execute();
```

### Zod Validation Pattern
```typescript
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// In route handler
const result = loginSchema.safeParse(body);
if (!result.success) {
  const error = result.error.issues[0];
  return res.status(400).json({
    error: error.message,
    field: error.path[0],
  });
}
```

### Auth Middleware
```typescript
import { authMiddleware } from '../middleware/auth.middleware';

// Apply to protected routes
router.get('/protected', authMiddleware, async (req, res) => {
  // req.user is available after authMiddleware
  const user = req.user;
  res.json({ user });
});
```

---

## Database Schema

### Users Table
```typescript
interface UserTable {
  id: string;                    // UUID
  username: string;              // Unique
  email: string;                 // Unique
  password: string;              // Bcrypt hashed
  fullName: string | null;
  isActive: boolean;             // Default true
  role: 'user' | 'admin';        // Default 'user'
  emailVerified: boolean;        // Default false
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  resetToken: string | null;
  resetTokenExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Migrations Table
```typescript
interface MigrationTable {
  id: number;
  name: string;
  executedAt: Date;
}
```

---

## Testing

### Vitest Workspace (`vitest.workspace.ts`)
```typescript
export default [
  {
    test: {
      name: 'backend',
      globals: true,
      environment: 'node',
      include: ['backend/tests/**/*.test.ts'],
      setupFiles: ['./backend/tests/setup.ts'],
      globalSetup: ['./backend/tests/globalSetup.ts'],
    },
  },
  {
    test: {
      name: 'frontend',
      globals: true,
      environment: 'jsdom',
      include: ['app/tests/**/*.test.tsx'],
      setupFiles: ['./app/tests/setup.ts'],
    },
  },
];
```

### Test Commands
```bash
# Run all tests
npm test

# Backend tests only (uses in-memory SQLite)
npm run test:backend

# Frontend tests only (mocks API calls)
npm run test:frontend

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## Common Tasks

### Add a New API Endpoint
1. Add route handler in `backend/routes/*.route.ts`
2. Add service method in `backend/services/*.service.ts` if needed
3. Add Zod validator in `backend/validators/*.ts` if needed
4. Update frontend API client in `app/lib/api.ts`
5. Add test in `backend/tests/*.test.ts`

### Add a New Page
1. Create route component in `app/routes/`
2. Add `clientLoader` export for data fetching if needed
3. Use `useLoaderData()` to access data in component
4. Add route config in `app/routes.ts`
5. Add navigation link in `app/components/layout/header.tsx`
6. Add test in `app/tests/*.test.tsx`

### Database Changes
1. Modify schema in `backend/database/types.ts`
2. Create migration in `backend/migrations/`
3. Run migration: `npm run migration:run`
4. Test rollback: `npm run migration:revert`

### Add Role-Based Access
1. Import `authMiddleware` from `backend/middleware/auth.middleware.ts`
2. Apply to route and check `req.user.role`
3. Frontend: Check `user.role` from auth context to show/hide admin links

---

## Troubleshooting

### Double API Requests on Route Load
- **Cause**: Using `useEffect` for data fetching (fires twice in React 18+ Strict Mode)
- **Solution**: Use React Router v7 `clientLoader` instead of `useEffect`

### CORS Errors
- Ensure backend CORS middleware allows frontend origin
- Check preflight OPTIONS handling in CORS middleware

### JWT Issues
- Verify `JWT_SECRET` is set in backend `.env`
- Check token format: `Authorization: Bearer <token>`
- Token includes: `userId`, `username`, `email`, `role`

### Database Errors
- **First time setup**: Run `npm run setup` to install dependencies and migrate database
- **Reset database**: Run `npm run refresh` to delete and recreate database (development only)
- Check database path in `backend/database/index.ts`

### Email Not Sending
- **Development**: Check terminal for simulation output (emails shown in console)
- **Production**: Set `RESEND_API_KEY` in `backend/.env`
- **Verification**: Check Resend dashboard for sent emails

### Tests Failing
- Backend tests use isolated in-memory SQLite database
- Frontend tests mock API calls (no backend needed)
- Run `npm run test:backend` and `npm run test:frontend` separately to isolate issues

---

## Deployment

### Frontend (Static Hosting)
```bash
npm run build
# Deploy build/client/ to:
# - Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront
```

### Backend (Node.js Server)
Deploy the `backend/` folder to any Node.js hosting:
- Railway, Render, Fly.io, AWS Lambda (with adapter), DigitalOcean App Platform

Set production environment variables:
- `NODE_ENV=production`
- `JWT_SECRET=<secure-random-string>`

### Docker
```bash
docker build -t hyperreact-app .
docker run -p 3000:3000 hyperreact-app
```

---

## Documentation Links

- [React Router v7](https://reactrouter.com/)
- [HyperExpress](https://github.com/kartikk221/hyper-express)
- [Kysely](https://kysely.dev/)
- [TailwindCSS v4](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [vitest](https://vitest.dev/)
