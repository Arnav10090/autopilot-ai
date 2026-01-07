'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Projects', icon: '📁', href: '/projects' },
  { label: 'Create Project', icon: '✨', href: '/create' },
  { label: 'Analytics', icon: '📊', href: '/analytics' },
  { label: 'Templates', icon: '📋', href: '/templates' },
  { label: 'Settings', icon: '⚙️', href: '/settings' },
  { label: 'Help', icon: '❓', href: '/help' },
];

export function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const sidenavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidenavRef.current && !sidenavRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        className="fixed top-20 left-4 z-40 lg:hidden p-2 rounded-lg bg-accent text-white hover:bg-accent-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidenavRef}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface dark:bg-surface-dark border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 lg:relative lg:top-0 lg:h-screen z-40 ${
          isOpen ? 'w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'
        } ${isCollapsed && !isOpen ? 'lg:w-20' : ''}`}
      >
        <nav id="main-nav" className="h-full overflow-y-auto">
          {/* Navigation items */}
          <ul className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-accent text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className={`font-medium whitespace-nowrap ${isCollapsed && !isOpen ? 'hidden lg:hidden' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse button (desktop only) */}
        <div className="hidden lg:flex justify-center p-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
