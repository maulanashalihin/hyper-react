import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useToast } from '../../components/ui/toast';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { verifyEmailSchema } from '../../lib/validation';
import { request } from '../../lib/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      const result = verifyEmailSchema.safeParse({ token });
      if (!result.success) {
        setVerificationStatus('error');
        error({
          type: 'error',
          title: 'Invalid token',
          description: result.error.issues[0]?.message || 'Please check your verification link',
        });
        setIsLoading(false);
        return;
      }

      try {
        await request('/api/auth/verify-email', {
          method: 'POST',
          body: { token },
        });

        setVerificationStatus('success');
        success({
          type: 'success',
          title: 'Email verified!',
          description: 'Your email has been verified successfully. Redirecting to dashboard...',
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err: any) {
        setVerificationStatus('error');
        error({
          type: 'error',
          title: 'Verification failed',
          description: err.message || 'Invalid or expired token. Please request a new verification link.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate, success, error]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      error({
        type: 'error',
        title: 'Resend verification',
        description: 'Please contact support to resend the verification email.',
      });
    } catch (err: any) {
      error({
        type: 'error',
        title: 'Resend failed',
        description: err.message || 'Failed to resend verification email.',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading || verificationStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                  <Loader2 className="h-6 w-6 text-violet-600 dark:text-violet-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Verifying your email
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we verify your email address...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Email Verified!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your email has been verified successfully.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Redirecting to dashboard...
                </p>
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
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Verify your email address to continue
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>
              {token
                ? 'This verification link is invalid or has expired.'
                : 'No verification token found in the URL.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Unable to Verify Email
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {token
                  ? 'The verification link you clicked may have expired or has already been used.'
                  : 'Please check your email for the verification link.'}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleResendVerification}
              variant="outline"
              className="w-full"
              isLoading={isResending}
            >
              {isResending ? 'Resending...' : 'Request New Verification Link'}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already verified?{' '}
              <a
                href="/auth/login"
                className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
              >
                Back to login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
