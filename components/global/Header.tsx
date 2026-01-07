'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to apply blur effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 0);
    });
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-md shadow-sm border-b border-neutral-200 dark:bg-surface-dark/80 dark:border-neutral-800'
          : 'bg-surface dark:bg-surface-dark'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus-visible:outline-offset-2"
            aria-label="AutoPilot AI Home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <span className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50 hidden sm:inline">
              AutoPilot
            </span>
          </Link>

          {/* Search bar (centered) */}
          <div className="flex-1 max-w-2xl mx-6 hidden md:block">
            <SearchBar />
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
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
