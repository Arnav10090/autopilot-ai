import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function Input({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          className={`w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 ${
            error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
          } ${icon ? 'pl-10' : ''} ${className}`}
        />

        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-danger mt-1.5">{error}</p>}
      {helperText && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">{helperText}</p>}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextArea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <textarea
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none ${
          error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
        } ${className}`}
      />

      {error && <p className="text-sm text-danger mt-1.5">{error}</p>}
      {helperText && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">{helperText}</p>}
    </div>
  );
}
