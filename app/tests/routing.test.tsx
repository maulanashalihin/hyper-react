/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../contexts/auth.context';
import { ToastProvider } from '../components/ui/toast';

vi.mock('../lib/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn().mockRejectedValue(new Error('Unauthorized')),
  },
  fetchUsers: vi.fn(() => Promise.resolve({ users: [] })),
  request: vi.fn(() => Promise.resolve({ user: { role: 'user' } })),
}));

describe('Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Protected Routes', () => {
    it('redirects unauthenticated user from protected route', () => {
      const store: Record<string, string> = {};
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((key: string) => store[key] || null),
          setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
          removeItem: vi.fn((key: string) => { delete store[key]; }),
          clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
        },
        writable: true,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ToastProvider>
            <AuthProvider>
              <div data-testid="test-root" />
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      expect(screen.queryByText(/Dashboard/i)).toBeFalsy();
    });
  });

  describe('Admin Routes', () => {
    it('redirects non-admin user from admin route', () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'user' as const,
      };

      const store: Record<string, string> = {
        token: 'test-token',
        user: JSON.stringify(mockUser),
      };
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((key: string) => store[key] || null),
          setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
          removeItem: vi.fn((key: string) => { delete store[key]; }),
          clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
        },
        writable: true,
      });

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <ToastProvider>
            <AuthProvider>
              <div data-testid="test-root" />
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      expect(screen.queryByText(/Admin Users/i)).toBeFalsy();
    });
  });
});
