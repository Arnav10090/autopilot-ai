import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', children, className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-accent/10 text-accent dark:bg-accent/20',
    success: 'bg-success/10 text-success dark:bg-success/20',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20',
    danger: 'bg-danger/10 text-danger dark:bg-danger/20',
    info: 'bg-accent-2/10 text-accent-2 dark:bg-accent-2/20',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs font-medium rounded-md',
    md: 'px-3 py-1.5 text-sm font-medium rounded-lg',
    lg: 'px-4 py-2 text-base font-semibold rounded-lg',
  };

  return (
    <span className={`inline-flex items-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
