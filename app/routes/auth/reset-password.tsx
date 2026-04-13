import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useToast } from '../../components/ui/toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { resetPasswordSchema } from '../../lib/validation';
import { request } from '../../lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { success, error } = useToast();

  const token = searchParams.get('token');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({ token, newPassword });
    if (!result.success) {
      error({
        type: 'error',
        title: 'Invalid input',
        description: result.error.issues[0]?.message || 'Please check your input',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      error({
        type: 'error',
        title: 'Passwords do not match',
        description: 'Please make sure both passwords match',
      });
      return;
    }

    setIsLoading(true);

    try {
      await request('/api/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword },
      });
      
      success({
        type: 'success',
        title: 'Password reset',
        description: 'Your password has been reset successfully. You can now log in.',
      });
      
      navigate('/auth/login');
    } catch (err: any) {
      error({
        type: 'error',
        title: 'Reset failed',
        description: err.message || 'Invalid or expired token. Please request a new reset link.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Invalid Reset Link
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This password reset link is invalid or has expired.
                </p>
                <Button
                  onClick={() => navigate('/auth/forgot-password')}
                  variant="outline"
                >
                  Request New Reset Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>
              Your new password must be at least 8 characters long
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<CheckCircle size={18} />}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <a href="/auth/login" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
                Back to login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
