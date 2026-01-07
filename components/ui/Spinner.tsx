import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent';
  className?: string;
}

export function Spinner({ size = 'md', variant = 'default', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const variantClasses = {
    default: 'border-neutral-300 dark:border-neutral-700 border-t-accent',
    accent: 'border-accent/20 border-t-accent',
  };

  return (
    <div className={`inline-flex ${className}`}>
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
