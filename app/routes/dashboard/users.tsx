import type { ClientLoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useToast } from '../../components/ui/toast';
import { fetchUsers, usersApi } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
  Edit,
} from 'lucide-react';
import type { User } from '../../lib/types';

// Loader function - runs before component renders (single request)
export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || localStorage.getItem('token');
  
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const response = await fetchUsers();
    return { users: response.users, error: null };
  } catch (error: any) {
    return { users: [], error: error.message || 'Failed to fetch users' };
  }
}

export default function UsersPage() {
  const { token } = useAuth();
  const { users: loaderUsers, error: loaderError } = useLoaderData<typeof clientLoader>();
  const fetcher = useFetcher();
  const toast = useToast();
  
  const [users, setUsers] = useState<User[]>(loaderUsers || []);
  const [error, setError] = useState(loaderError || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Refresh users using fetcher (doesn't trigger full reload)
  async function refreshUsers() {
    if (!token) return;

    try {
      const response = await usersApi.getAll(token);
      setUsers(response.users);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete || !token) return;

    if (!confirm('Are you sure you want to delete this user?')) {
      setUserToDelete(null);
      return;
    }

    try {
      await usersApi.delete(userToDelete, token);
      toast.success({
        type: 'success',
        title: 'User deleted',
        description: 'The user has been successfully removed.',
      });
      setUsers(users.filter((u) => u.id !== userToDelete));
      setUserToDelete(null);
    } catch (err: any) {
      toast.error({
        type: 'error',
        title: 'Delete failed',
        description: err.message || 'Failed to delete user',
      });
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Users Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your team members and their permissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={refreshUsers}>
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </Button>
              <Button>
                <Plus size={18} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Users Table */}
        <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                All Users ({filteredUsers.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  <UserCheck size={12} className="mr-1" />
                  {users.filter((u) => u.isActive).length} Active
                </Badge>
                <Badge variant="error">
                  <UserX size={12} className="mr-1" />
                  {users.filter((u) => !u.isActive).length} Inactive
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No users found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first user'}
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
                        Status
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
                    {filteredUsers.map((user) => (
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
                          <Badge variant={user.isActive ? 'success' : 'error'}>
                            {user.isActive ? (
                              <>
                                <UserCheck size={12} className="mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX size={12} className="mr-1" />
                                Inactive
                              </>
                            )}
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
                            <Button variant="ghost" size="icon">
                              <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                            </Button>
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
        </Card>
      </div>

      {/* Delete Confirmation Dialog - Simple approach */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setUserToDelete(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setUserToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleDeleteUser}>
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
