import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: 'default' | 'glass' | 'elevated' | 'glow';
  role?: string;
  tabIndex?: number;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className = '',
  isHoverable = false,
  variant = 'default',
  role,
  tabIndex,
  style,
}: CardProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800/50 shadow-sm',
    glass: 'glass-card backdrop-blur-xl bg-white/80 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-800/30',
    elevated: 'bg-white dark:bg-neutral-900/70 backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-neutral-100 dark:border-transparent',
    glow: 'bg-white dark:bg-neutral-900/50 backdrop-blur-xl border border-accent/20 dark:border-indigo-500/20 shadow-lg shadow-accent/10 dark:shadow-indigo-500/10',
  };

  const hoverClasses = isHoverable
    ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:border-accent/30 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-accent/10 dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900'
    : 'transition-all duration-300';

  return (
    <div
      className={`rounded-2xl p-6 ${variantClasses[variant]} ${hoverClasses} ${className}`}
      role={role}
      tabIndex={isHoverable ? (tabIndex ?? 0) : undefined}
      style={style}
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
        {title && <h3 className="font-display font-700 text-xl text-neutral-900 dark:text-neutral-50">{title}</h3>}
        {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">{subtitle}</p>}
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
      className={`pt-6 ${divider ? 'border-t border-neutral-200 dark:border-neutral-800/50' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
