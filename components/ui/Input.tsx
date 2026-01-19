import React, { useId, useState } from 'react';

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
  id,
  name,
  ...props
}: InputProps) {
  const _uid = useId();
  const sanitizedUid = String(_uid).replace(/[:]/g, '-');
  const inputId = id || name || `input-${sanitizedUid}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const inputType = props.type === 'password' && showPassword ? 'text' : props.type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative group">
        <input
          {...props}
          type={inputType}
          id={inputId}
          name={name}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all duration-300 focus:outline-none focus:border-accent dark:focus:border-indigo-500/50 focus:ring-2 focus:ring-accent/20 dark:focus:ring-indigo-500/20 focus:shadow-lg focus:shadow-accent/10 dark:focus:shadow-indigo-500/10 hover:border-neutral-400 dark:hover:border-neutral-700 ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${icon ? 'pl-11' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
        />

        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 group-focus-within:text-accent dark:group-focus-within:text-indigo-400 transition-colors" aria-hidden="true">
            {icon}
          </div>
        )}

        {props.type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none focus:text-accent dark:focus:text-accent transition-colors p-1 rounded-md"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        
        {/* Focus glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 group-focus-within:from-indigo-500/5 group-focus-within:to-cyan-500/5 transition-all duration-300 pointer-events-none" />
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-400 mt-2 flex items-center gap-1.5" role="alert">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && (
        <p id={helperId} className="text-sm text-neutral-500 mt-2">
          {helperText}
        </p>
      )}
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
  id,
  name,
  ...props
}: TextAreaProps) {
  const _tuid = useId();
  const sanitizedTuid = String(_tuid).replace(/[:]/g, '-');
  const textareaId = id || name || `textarea-${sanitizedTuid}`;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative group">
        <textarea
          {...props}
          id={textareaId}
          name={name}
          rows={props.rows || 5}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all duration-300 focus:outline-none focus:border-accent dark:focus:border-indigo-500/50 focus:ring-2 focus:ring-accent/20 dark:focus:ring-indigo-500/20 focus:shadow-lg focus:shadow-accent/10 dark:focus:shadow-indigo-500/10 hover:border-neutral-400 dark:hover:border-neutral-700 resize-none ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
        />
        
        {/* Focus glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 group-focus-within:from-indigo-500/5 group-focus-within:to-cyan-500/5 transition-all duration-300 pointer-events-none" />
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-400 mt-2 flex items-center gap-1.5" role="alert">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && (
        <p id={helperId} className="text-sm text-neutral-500 mt-2">
          {helperText}
        </p>
      )}
    </div>
  );
}
