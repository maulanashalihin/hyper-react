import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { useToast } from '../../components/ui/toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { User, Mail, Trash2, Loader2 } from 'lucide-react';
import { profileUpdateSchema } from '../../lib/validation';

export default function ProfileSettings() {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = profileUpdateSchema.parse(formData);
      
      const emailChanged = validatedData.email !== user?.email;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to update profile');
      }

      await refreshUser();

      success({
        type: 'success',
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      if (emailChanged) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/resend-verification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: validatedData.email }),
          });
          
          success({
            type: 'success',
            title: 'Verification email sent',
            description: 'Please check your new email for verification.',
          });
        } catch (err: any) {
          console.error('Failed to send verification email:', err);
        }
      }
    } catch (err: any) {
      error({
        type: 'error',
        title: 'Update failed',
        description: err.message || 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to delete account');
      }

      success({
        type: 'success',
        title: 'Account deleted',
        description: 'Your account has been permanently deleted.',
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth/register');
    } catch (err: any) {
      error({
        type: 'error',
        title: 'Delete failed',
        description: err.message || 'Failed to delete account',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your profile details and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                icon={<User size={18} />}
                required
                autoComplete="username"
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail size={18} />}
                required
                autoComplete="email"
              />

              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                icon={<User size={18} />}
                autoComplete="name"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? 'Saving changes...' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-red-200 dark:border-red-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions related to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Delete Account</CardTitle>
                <CardDescription>
                  This action cannot be undone. Please enter your password to confirm.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeletePassword('');
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="danger"
                      className="flex-1"
                      isLoading={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
