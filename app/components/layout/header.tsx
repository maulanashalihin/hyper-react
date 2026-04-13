import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { useTheme } from '../../contexts/theme.context';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  Shield,
} from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-all duration-200">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              React SPA
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  to="/dashboard/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Users size={16} />
                  <span className="hidden sm:inline">Users</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <Shield size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                <Link
                  to="/settings/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Settings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
              </>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-400"
            >
              {actualTheme === 'dark' ? (
                <Sun size={18} className="rotate-0 transition-transform duration-200" />
              ) : (
                <Moon size={18} className="rotate-0 transition-transform duration-200" />
              )}
            </Button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 pl-2">
                  <Avatar name={user?.fullName || user?.username} size="sm" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {user?.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400"
                >
                  <LogOut size={16} className="mr-1.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
