/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../contexts/auth.context';
import { ToastProvider } from '../components/ui/toast';
import Login from '../routes/auth/login';
import Register from '../routes/auth/register';

vi.mock('../lib/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
  },
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    MemoryRouter: actual.MemoryRouter,
  };
});

describe('Auth Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  describe('Login Page', () => {
    it('renders login page with form elements', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <AuthProvider>
              <Login />
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(/Welcome back/i)).toBeTruthy();
      expect(screen.getByText(/Sign in to your account/i)).toBeTruthy();
      expect(screen.getByLabelText(/Username/i)).toBeTruthy();
      expect(screen.getByLabelText(/Password/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Sign in/i })).toBeTruthy();
      expect(screen.getByText(/Don't have an account/i)).toBeTruthy();
    });
  });

  describe('Register Page', () => {
    it('renders register page with form elements', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <AuthProvider>
              <Register />
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(/Create an account/i)).toBeTruthy();
      expect(screen.getByText(/Start your journey with us/i)).toBeTruthy();
      expect(screen.getByLabelText(/Full Name/i)).toBeTruthy();
      expect(screen.getByLabelText(/Username/i)).toBeTruthy();
      expect(screen.getByLabelText(/Email/i)).toBeTruthy();
      expect(screen.getByLabelText(/Password/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Create account/i })).toBeTruthy();
      expect(screen.getByText(/Already have an account/i)).toBeTruthy();
    });
  });
});
