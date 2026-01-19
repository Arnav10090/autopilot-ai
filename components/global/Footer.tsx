'use client';



export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface dark:bg-surface-dark border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="font-display font-700 text-neutral-900 dark:text-neutral-50">
                AutoPilot AI
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              © {currentYear} AutoPilot AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
