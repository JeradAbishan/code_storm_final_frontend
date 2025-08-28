/**
 * Google OAuth Callback Page
 * Handles the OAuth callback and processes authentication
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      setStatus('error');
      setMessage(error === 'access_denied' 
        ? 'You denied access to your Google account.'
        : 'An error occurred during Google authentication.'
      );
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received from Google.');
      return;
    }

    // Redirect to backend callback endpoint
    const backendCallbackUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/auth/google/callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}`;
    
    window.location.href = backendCallbackUrl;
  }, [searchParams]);



  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Signing you in...';
      case 'success':
        return 'Welcome to EduCapture!';
      case 'error':
        return 'Authentication failed';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we complete your Google sign-in.';
      case 'success':
        return 'You will be redirected to your dashboard shortly.';
      case 'error':
        return 'There was a problem signing you in with Google.';
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
                  : status === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
              }`}>
                {message}
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  Try again
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => router.push('/auth/register')}
                  className="w-full"
                >
                  Create account instead
                </Button>
              </div>
            )}
            
            {status === 'success' && (
              <Button 
                onClick={() => {
                  const redirectTo = localStorage.getItem('auth_redirect') || '/dashboard';
                  localStorage.removeItem('auth_redirect');
                  router.push(redirectTo);
                }}
                className="w-full"
              >
                Continue to EduCapture
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing Google authentication...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
