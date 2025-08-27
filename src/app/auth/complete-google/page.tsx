/**
 * Complete Google OAuth Page
 * Handles the completion of Google OAuth flow with token
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/auth';

export default function CompleteGooglePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    date_of_birth: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No authentication token received from Google.');
      return;
    }

    // Decode the JWT token to get user data
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode the payload (base64)
      const payload = JSON.parse(atob(tokenParts[1]));

      // Pre-fill form with available data
      setFormData({
        date_of_birth: '',
        first_name: payload.first_name || '',
        last_name: payload.last_name || ''
      });

      // Show form to collect missing information
      setStatus('form');
    } catch (error) {
      console.error('Token decode error:', error);
      setStatus('error');
      setMessage('Invalid authentication token. Please try logging in again.');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = searchParams.get('token');
    if (!token) return;

    try {
      setStatus('loading');

      // Complete the Google OAuth flow with collected data
      const response = await authService.completeGoogleAuth({
        google_token: token,
        date_of_birth: formData.date_of_birth,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined
      });

      // Update auth context with user data
      if (response.user) {
        await login(response.user.email, ''); // Password not needed for OAuth
      }

      setStatus('success');
      setMessage('Successfully completed Google registration!');

      // Redirect after a short delay
      setTimeout(() => {
        const redirectTo = localStorage.getItem('auth_redirect') || '/dashboard';
        localStorage.removeItem('auth_redirect');
        router.push(redirectTo);
      }, 2000);
    } catch (error) {
      console.error('Google auth completion error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to complete Google registration.');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case 'form':
        return <Calendar className="h-12 w-12 text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Completing Registration...';
      case 'form':
        return 'Complete Your Profile';
      case 'success':
        return 'Registration Complete!';
      case 'error':
        return 'Registration Failed';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we complete your registration.';
      case 'form':
        return 'We need your date of birth to complete your Google account setup. Name fields are optional and can be updated later.';
      case 'success':
        return 'You will be redirected to your dashboard shortly.';
      case 'error':
        return 'There was an error completing your registration.';
    }
  };

  if (status === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              {getIcon()}
            </div>
            <CardTitle className="text-xl">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name (from Google)
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pre-filled from your Google account (optional)
                </p>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name (from Google)
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pre-filled from your Google account (optional)
                </p>
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth *
                </label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Complete Google Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            {getIcon()}
          </div>
          <CardTitle className="text-xl">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>

          {status === 'error' && (
            <div className="space-y-2">
              <Button onClick={() => router.push('/auth/login')} className="w-full">
                Back to Sign In
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting you now...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
