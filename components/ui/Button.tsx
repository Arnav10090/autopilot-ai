import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-display font-600 transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-accent hover:bg-blue-700 text-white shadow-md hover:shadow-lg dark:bg-accent dark:hover:bg-blue-600',
    secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-50',
    outline: 'border-2 border-accent text-accent hover:bg-accent/5 dark:border-accent dark:text-accent dark:hover:bg-accent/10',
    ghost: 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
    danger: 'bg-danger hover:bg-red-600 text-white shadow-md hover:shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2.5 text-base rounded-lg gap-2',
    lg: 'px-6 py-3 text-lg rounded-lg gap-2.5',
    xl: 'px-8 py-4 text-xl rounded-xl gap-3',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
