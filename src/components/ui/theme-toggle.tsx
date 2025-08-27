/**
 * Theme Toggle Component
 * Toggle between light and dark themes (defaults to system)
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has manually set a theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      // User has manually set a preference, use it
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // No manual preference, use system theme but don't save it
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  const getIcon = () => {
    return theme === 'light' ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    );
  };

  const getLabel = () => {
    return theme === 'light' ? 'Light' : 'Dark';
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Theme toggle</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      title={`Current theme: ${getLabel()}. Click to toggle theme.`}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
