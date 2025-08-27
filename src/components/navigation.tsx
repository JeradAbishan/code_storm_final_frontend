/**
 * Navigation Component
 * Main navigation with authentication integration
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show navigation on auth pages
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              EduCapture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link 
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/notes"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive('/notes') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Notes
                </Link>
                <Link 
                  href="/library"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive('/library') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Library
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                  {user.first_name}
                </span>
                
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-950">
            <div className="space-y-1 px-2 py-3">
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/notes"
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive('/notes')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Notes
                  </Link>
                  <Link
                    href="/library"
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive('/library')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Library
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
