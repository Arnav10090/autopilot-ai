'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';

export function SideNav() {
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state
  const { isCollapsed, toggleSidebar } = useSidebar(); // Global desktop toggle state
  const pathname = usePathname();
  const sidenavRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { label: t('projects'), icon: '📁', href: '/projects' },
    { label: t('createProject'), icon: '✨', href: '/create' },
    { label: t('analytics'), icon: '📊', href: '/analytics' },
    { label: t('templates'), icon: '📋', href: '/templates' },
    { label: t('settings'), icon: '⚙️', href: '/settings' },
    { label: t('help'), icon: '❓', href: '/help' },
  ];

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
        className="fixed top-20 left-4 z-50 lg:hidden p-2 rounded-lg bg-accent text-white hover:bg-accent-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidenavRef}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface dark:bg-surface-dark border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 lg:fixed lg:top-16 lg:h-[calc(100vh-4rem)] z-40 ${isOpen ? 'w-64' : '-translate-x-full lg:translate-x-0'
          } ${isCollapsed && !isOpen ? 'lg:w-20' : 'lg:w-64'}`}
      >

        {/* Toggle Button Wrapper - Top (Optional per request alignment) */}
        <div className={`hidden lg:flex items-center ${isCollapsed ? 'justify-center' : 'justify-end pr-4'} py-4`}>
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
          >
            {isCollapsed ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        <nav id="main-nav" className="h-[calc(100%-4rem)] overflow-y-auto">
          {/* Navigation items */}
          <ul className="px-3 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-4 px-4'} py-3.5 rounded-xl transition-all ${isActive(item.href)
                      ? 'bg-accent text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    } group relative`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <span className={`font-semibold text-lg whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}>
                    {item.label}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-neutral-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
