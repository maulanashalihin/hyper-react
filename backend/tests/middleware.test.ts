import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { db, initializeDatabase, closeDatabase } from '../database/index.js';
import { runMigrations } from '../database/migration-runner.js';
import { authService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

beforeAll(async () => {
  await initializeDatabase();
  await runMigrations();
});

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('Middleware', () => {
  it('should reject requests without auth token', async () => {
    const mockReq = {
      headers: {},
    } as any;

    const mockRes = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.body = data;
        return this;
      },
      statusCode: 200,
      body: null,
    } as any;

    const result = await authMiddleware(mockReq, mockRes);

    expect(result).toBe(false);
    expect(mockRes.statusCode).toBe(401);
    expect(mockRes.body.error).toBe('Authorization header required');
  });

  it('should allow admin access with admin role', async () => {
    const adminUser = await authService.register({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
    });

    await db
      .updateTable('users')
      .set({ role: 'admin' })
      .where('id', '=', adminUser.user.id)
      .execute();

    const admin = await db.selectFrom('users').selectAll().where('id', '=', adminUser.user.id).executeTakeFirst();

    const newToken = jwt.sign(
      { userId: admin!.id, username: admin!.username, email: admin!.email, role: admin!.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    const mockReq = {
      headers: {
        authorization: `Bearer ${newToken}`,
      },
    } as any;

    const mockRes = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.body = data;
        return this;
      },
      statusCode: 200,
      body: null,
    } as any;

    const authResult = await authMiddleware(mockReq, mockRes);
    expect(authResult).toBe(true);

    const roleResult = requireRole(['admin'])(mockReq, mockRes);
    expect(roleResult).toBe(true);
  });

  it('should reject non-admin access to admin route', async () => {
    const regularUser = await authService.register({
      username: 'regularuser',
      email: 'regular@example.com',
      password: 'password123',
    });

    const mockReq = {
      headers: {
        authorization: `Bearer ${regularUser.token}`,
      },
      user: regularUser.user,
    } as any;

    const mockRes = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.body = data;
        return this;
      },
      statusCode: 200,
      body: null,
    } as any;

    const roleResult = requireRole(['admin'])(mockReq, mockRes);

    expect(roleResult).toBe(false);
    expect(mockRes.statusCode).toBe(403);
    expect(mockRes.body.error).toBe('Access denied: Insufficient permissions');
  });
});
