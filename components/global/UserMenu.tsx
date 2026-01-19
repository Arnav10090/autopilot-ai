'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState({ name: 'Guest', email: '' });
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("UserMenu loaded session:", parsed); // Debug
      setUser(parsed);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setIsOpen(false);
    // Force a hard navigation to clear any client-side state/cache
    window.location.href = '/auth/signin';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-gradient-to-br dark:from-accent dark:to-accent-2 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-accent"
      >
        {(user?.name || 'Guest').charAt(0)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 animate-scale-in origin-top-right">
          <div className="p-1">
            <div className="px-3 py-2 mb-1 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user?.email || ''}
              </p>
            </div>
            
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/settings#account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  {t('profile')}
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  {t('settings')}
                </Link>
              </li>
              <li>
                <Link
                  href="/settings#api-keys"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  API Keys
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="p-1 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-lg transition-colors group"
            >
              {t('signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
