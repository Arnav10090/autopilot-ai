import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: 'default' | 'glass' | 'elevated';
  role?: string;
  tabIndex?: number;
}

export function Card({
  children,
  className = '',
  isHoverable = false,
  variant = 'default',
  role,
  tabIndex,
}: CardProps) {
  const variantClasses = {
    default: 'bg-surface dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800',
    glass: 'glass',
    elevated: 'bg-surface dark:bg-surface-dark shadow-lg',
  };

  const hoverClasses = isHoverable
    ? 'cursor-pointer hover:shadow-lg hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'
    : 'transition-all duration-300';

  return (
    <div
      className={`rounded-xl p-6 ${variantClasses[variant]} ${hoverClasses} ${className}`}
      role={role}
      tabIndex={isHoverable ? (tabIndex ?? 0) : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className = '',
}: CardHeaderProps) {
  if (children) {
    return <div className={`mb-6 ${className}`}>{children}</div>;
  }

  return (
    <div className={`mb-6 flex items-start justify-between gap-4 ${className}`}>
      <div className="flex-1">
        {title && <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50">{title}</h3>}
        {subtitle && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export function CardFooter({ children, className = '', divider = true }: CardFooterProps) {
  return (
    <div
      className={`pt-6 ${divider ? 'border-t border-neutral-200 dark:border-neutral-800' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
