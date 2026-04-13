import type { ClientLoaderFunctionArgs } from 'react-router';
import { redirect, useFetcher, useLoaderData } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useToast } from '../../components/ui/toast';
import { request as apiRequest } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import {
  Users,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  ChevronDown,
} from 'lucide-react';
import type { User } from '../../lib/types';

interface AdminUser extends User {
  role: 'user' | 'admin';
}

interface LoaderData {
  users: AdminUser[];
  error: string | null;
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs): Promise<LoaderData> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || localStorage.getItem('token');
  
  if (!token) {
    throw redirect('/auth/login');
  }

  try {
    const userResponse = await apiRequest<{ user: { role: string } }>('/api/auth/me', { token });
    
    if (userResponse.user.role !== 'admin') {
      throw redirect('/dashboard');
    }

    const response = await apiRequest<{ users: AdminUser[] }>('/api/admin/users', { token });
    return { users: response.users, error: null };
  } catch (error: any) {
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    return { users: [], error: error.message || 'Failed to fetch users' };
  }
}

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const { users: loaderUsers, error: loaderError } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const toast = useToast();
  
  const [users, setUsers] = useState<AdminUser[]>(loaderUsers || []);
  const [error, setError] = useState(loaderError || '');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast.error({
        type: 'error',
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
      });
      window.location.href = '/dashboard';
    }
  }, [currentUser, toast]);

  async function refreshUsers() {
    if (!token) return;

    try {
      const response = await apiRequest<{ users: AdminUser[] }>('/api/admin/users', { token });
      setUsers(response.users);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    }
  }

  async function handleRoleChange(userId: string, newRole: 'user' | 'admin') {
    if (!token) return;

    try {
      await apiRequest(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role: newRole },
        token,
      });
      
      toast.success({
        type: 'success',
        title: 'Role Updated',
        description: `User role changed to ${newRole}.`,
      });
      
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err: any) {
      toast.error({
        type: 'error',
        title: 'Update Failed',
        description: err.message || 'Failed to update user role',
      });
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete || !token) return;

    try {
      await apiRequest(`/api/admin/users/${userToDelete}`, {
        method: 'DELETE',
        token,
      });
      
      toast.success({
        type: 'success',
        title: 'User Deleted',
        description: 'The user has been successfully removed.',
      });
      
      setUsers(users.filter((u) => u.id !== userToDelete));
      setUserToDelete(null);
    } catch (err: any) {
      toast.error({
        type: 'error',
        title: 'Delete Failed',
        description: err.message || 'Failed to delete user',
      });
    }
  }

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  if (loaderError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{loaderError}</p>
          <Button onClick={refreshUsers}>
            <RefreshCw size={18} className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage users and system permissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={refreshUsers}>
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                All Users ({users.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  <UserCheck size={12} className="mr-1" />
                  {users.filter((u) => u.role === 'admin').length} Admins
                </Badge>
                <Badge variant="info">
                  <Users size={12} className="mr-1" />
                  {users.filter((u) => u.role === 'user').length} Users
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {paginatedUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No users found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Get started by inviting your first user
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.fullName || user.username} />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user.username}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                              {user.fullName && (
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {user.fullName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={user.role === 'admin' ? 'error' : 'default'}>
                            <Shield size={12} className="mr-1" />
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <div className="relative">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <ChevronDown
                                size={16}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setUserToDelete(user.id)}
                            >
                              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          
          {totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {userToDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setUserToDelete(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete User
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDeleteUser}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
