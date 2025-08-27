/**
 * Authentication Context Provider
 * Global state management for user authentication
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthApiError } from '@/lib/auth';
import { 
  User, 
  AuthContextType, 
  RegisterRequest, 
  UserProfileUpdateRequest 
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // User is not authenticated or token is invalid
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const userData = await authService.register(data);
      // Don't set user as authenticated since email verification is required
      // setUser(userData);
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails on backend, clear local state
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
    } catch (error) {
      // Even if logout fails on backend, clear local state
      console.error('Logout all error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: UserProfileUpdateRequest) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw new Error(error.message);
      }
      throw new Error('Profile update failed');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
    } catch (error) {
      // If refresh fails, user needs to login again
      setUser(null);
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      await authService.resendVerification(email);
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw new Error(error.message);
      }
      throw new Error('Failed to resend verification email');
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      // After email verification, check auth status to get updated user
      await checkAuthStatus();
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw new Error(error.message);
      }
      throw new Error('Email verification failed');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    refreshToken,
    resendVerification,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      // In a real app, redirect to login page
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p>Please log in to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}
