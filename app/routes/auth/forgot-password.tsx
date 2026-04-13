import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useToast } from '../../components/ui/toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema } from '../../lib/validation';
import { request } from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { success, error } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      error({
        type: 'error',
        title: 'Invalid email',
        description: result.error.issues[0]?.message || 'Please enter a valid email',
      });
      return;
    }

    setIsLoading(true);

    try {
      await request('/api/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
      
      setIsSubmitted(true);
      success({
        type: 'success',
        title: 'Reset link sent',
        description: 'If an account exists with this email, you will receive a password reset link.',
      });
    } catch (err: any) {
      error({
        type: 'error',
        title: 'Request failed',
        description: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No worries - we'll send you reset instructions
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Check your email
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If an account exists with this email, you will receive a password reset link shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                  required
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link to="/auth/login" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 inline-flex items-center gap-1">
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
