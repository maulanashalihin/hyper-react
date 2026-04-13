import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { db, initializeDatabase, closeDatabase } from '../database/index.js';
import { runMigrations } from '../database/migration-runner.js';
import { authService } from '../services/auth.service';

beforeAll(async () => {
  await initializeDatabase();
  await runMigrations();
});

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('Auth Service', () => {
  it('should register a new user', async () => {
    const result = await authService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    expect(result.user).toHaveProperty('id');
    expect(result.user.username).toBe('testuser');
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
  });

  it('should login with valid credentials', async () => {
    await authService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    const result = await authService.login({
      username: 'testuser',
      password: 'password123',
    });

    expect(result.user.username).toBe('testuser');
    expect(result.token).toBeDefined();
  });

  it('should handle forgot-password request', async () => {
    await authService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    await expect(authService.forgotPassword('test@example.com')).resolves.not.toThrow();

    const user = await db.selectFrom('users').selectAll().where('email', '=', 'test@example.com').executeTakeFirst();
    expect(user?.resetToken).toBeDefined();
  });

  it('should reset password with valid token', async () => {
    await authService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    await authService.forgotPassword('test@example.com');

    const user = await db.selectFrom('users').selectAll().where('email', '=', 'test@example.com').executeTakeFirst();

    await authService.resetPassword(user!.resetToken!, 'newpassword123');

    const updatedUser = await db.selectFrom('users').selectAll().where('email', '=', 'test@example.com').executeTakeFirst();
    expect(updatedUser?.resetToken).toBeNull();
  });
});
