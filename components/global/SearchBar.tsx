'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SEARCH_SUGGESTIONS = [
  { label: 'Projects', icon: '📁', href: '/projects' },
  { label: 'Create Project', icon: '✨', href: '/create' },
  { label: 'Analytics', icon: '📊', href: '/analytics' },
  { label: 'Templates', icon: '📋', href: '/templates' },
  { label: 'Settings', icon: '⚙️', href: '/settings' },
  { label: 'Help & Support', icon: '❓', href: '/help' },
];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<typeof SEARCH_SUGGESTIONS>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const results = SEARCH_SUGGESTIONS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(results);
      setIsOpen(true);
    } else {
      setFiltered(SEARCH_SUGGESTIONS);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (href: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search projects, templates..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          className="w-full px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-2 focus:outline-offset-0 focus:outline-accent transition-all"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Dropdown suggestions */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-50">
          <ul className="py-1" role="listbox">
            {filtered.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleSelect(item.href)}
                  className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center space-x-3 focus-visible:outline-offset-0 focus-visible:outline-accent"
                  role="option"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
