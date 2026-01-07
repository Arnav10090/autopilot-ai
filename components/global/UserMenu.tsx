'use client';

import { useState, useRef, useEffect } from 'react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        U
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-50">
          <ul className="py-1">
            <li>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-900 dark:text-neutral-50"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-900 dark:text-neutral-50"
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-900 dark:text-neutral-50"
              >
                API Keys
              </button>
            </li>
            <li className="border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-danger/10 transition-colors text-danger font-medium"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
