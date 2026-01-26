'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { Logo } from './Logo';

import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Detect scroll to apply blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled
        ? 'bg-surface/80 backdrop-blur-md dark:bg-surface-dark/80'
        : 'bg-surface dark:bg-surface-dark'
        }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus-visible:outline-offset-2"
            aria-label="AutoPilot AI Home"
          >
            <Logo className="w-8 h-8 text-neutral-900 dark:text-neutral-50" />
            <span className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50 hidden sm:inline">
              AutoPilot
            </span>
          </Link>

          {/* Search bar (centered) */}
          <div className="flex-1 max-w-2xl mx-6 hidden md:block">
            <SearchBar />
          </div>

          {/* User menu and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
