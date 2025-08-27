/**
 * Authentication Guard Component
 * Protects routes that require authentication
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireVerification = true,
  redirectTo 
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      // Store the intended destination for redirect after login
      localStorage.setItem('auth_redirect', pathname);
      router.push(redirectTo || '/auth/login');
      return;
    }

    // If user is logged in but email verification is required and not verified
    if (requireAuth && requireVerification && user && !user.is_email_verified) {
      router.push('/auth/verify-email');
      return;
    }

    // If user is logged in but trying to access auth pages, redirect to dashboard
    if (user && pathname.startsWith('/auth/')) {
      const redirectPath = localStorage.getItem('auth_redirect') || '/dashboard';
      localStorage.removeItem('auth_redirect');
      router.push(redirectPath);
      return;
    }
  }, [user, isLoading, requireAuth, requireVerification, router, pathname, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg animate-pulse">
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            EduCapture
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If verification is required but user is not verified, don't render children
  if (requireAuth && requireVerification && user && !user.is_email_verified) {
    return null;
  }

  // Render children if all auth requirements are met
  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuthGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  const AuthGuardedComponent = (props: P) => {
    return (
      <AuthGuard {...options}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };

  AuthGuardedComponent.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthGuardedComponent;
}
