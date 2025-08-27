/**
 * Email Verification Page
 * Page to handle email verification tokens
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const data = await authService.verifyEmail(verificationToken);

      setStatus('success');
      setMessage('Your email has been successfully verified!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?verified=true');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new one.');
        } else {
          setStatus('error');
          setMessage(error.message || 'Email verification failed');
        }
      } else {
        setStatus('error');
        setMessage('Email verification failed');
      }
    }
  };

  const resendVerificationEmail = async () => {
    try {
      // For now, we'll show a message asking the user to check their email
      // In a production app, you might want to decode the token to get the email
      // or store the email in localStorage during registration
      setMessage('Please check your email for the original verification link, or register again to receive a new one.');
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <Mail className="h-12 w-12 text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying your email...';
      case 'success':
        return 'Email verified!';
      case 'error':
        return 'Verification failed';
      case 'expired':
        return 'Link expired';
      default:
        return 'Email verification';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we verify your email address.';
      case 'success':
        return 'You will be redirected to the login page shortly.';
      case 'error':
        return 'There was a problem verifying your email address.';
      case 'expired':
        return 'The verification link has expired. Please request a new one.';
      default:
        return 'Verifying your email address...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              {getIcon()}
            </div>
            <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                status === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              }`}>
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              {status === 'expired' && (
                <Button 
                  onClick={resendVerificationEmail}
                  className="w-full"
                >
                  Send new verification email
                </Button>
              )}
              
              {status === 'success' && (
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  Continue to sign in
                </Button>
              )}
              
              {(status === 'error' || status === 'expired') && (
                <Button 
                  variant="outline"
                  onClick={() => router.push('/auth/register')}
                  className="w-full"
                >
                  Back to registration
                </Button>
              )}
              
              <Button 
                variant="ghost"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Back to home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
