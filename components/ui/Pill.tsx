import React from 'react';

interface PillProps {
  children: React.ReactNode;
  onRemove?: () => void;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Pill({ children, onRemove, variant = 'default', className = '' }: PillProps) {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    accent: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent',
    success: 'bg-success/10 text-success dark:bg-success/20',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20',
    danger: 'bg-danger/10 text-danger dark:bg-danger/20',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="ml-1 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-current"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
