'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface dark:bg-surface-dark border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="font-display font-700 text-neutral-900 dark:text-neutral-50">
                AutoPilot AI
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Transform ideas into execution-ready project plans.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                  Status Page
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {currentYear} AutoPilot AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Version & Support */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
          <span>v1.0.0 • Powered by agentic AI</span>
          <a
            href="mailto:support@autopilot.ai"
            className="hover:text-accent transition-colors"
          >
            support@autopilot.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
