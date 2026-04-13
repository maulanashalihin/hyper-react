/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../contexts/auth.context';
import { ToastProvider } from '../components/ui/toast';
import ProfileSettings from '../routes/settings/profile';
import SecuritySettings from '../routes/settings/security';

vi.mock('../lib/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
  },
}));

const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'user' as const,
};

describe('Settings Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  describe('Profile Settings Page', () => {
    it('renders profile settings page with form elements', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <AuthProvider>
              <ProfileSettings />
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(/Profile Settings/i)).toBeTruthy();
      expect(screen.getByText(/Manage your account information/i)).toBeTruthy();
      expect(screen.getByLabelText(/Username/i)).toBeTruthy();
      expect(screen.getByLabelText(/Email/i)).toBeTruthy();
      expect(screen.getByLabelText(/Full Name/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Save changes/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /Delete Account/i })).toBeTruthy();
    });
  });

  describe('Security Settings Page', () => {
    it('renders security settings page with form elements', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <AuthProvider>
              <SecuritySettings />
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(/Security Settings/i)).toBeTruthy();
      expect(screen.getByText(/Manage your password and security/i)).toBeTruthy();
      expect(screen.getByLabelText(/Current Password/i)).toBeTruthy();
      expect(screen.getByLabelText(/New Password/i)).toBeTruthy();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Change password/i })).toBeTruthy();
    });
  });
});
