'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  label?: string;
  value: string | number;
  onChange: (value: any) => void;
  options?: Option[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  name?: string;
  className?: string; // Class for the trigger button
  containerClassName?: string; // Class for the outer container
  disabled?: boolean;
  children?: React.ReactNode; // For backwards compatibility if we want to parse children, but options prop is better
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  helperText,
  name,
  className = '',
  containerClassName = 'w-full',
  disabled = false,
  children,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // If options are not provided but children are, try to extract them (simple support)
  // detailed parsing omitted for simplicity, relying on 'options' prop for best result
  const internalOptions = options.length > 0 ? options : React.Children.toArray(children).map((child: any) => ({
    label: child.props.children,
    value: child.props.value
  }));

  const selectedOption = internalOptions.find(opt => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    if (name) {
       // Simulate event for compatibility with some handlers if needed, 
       // but mostly we just return the value. 
       // If the parent expects an event, they should create a wrapper.
       // However, to make it easier for ProjectForm, let's just pass the value directly 
       // and update ProjectForm to handle it.
       onChange({ target: { name, value: optionValue } });
    } else {
       onChange(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${containerClassName}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl bg-white dark:bg-neutral-900/50 backdrop-blur-sm border transition-all duration-200 ${
          error
            ? 'border-red-500/50 text-red-500'
            : isOpen
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-neutral-400' : 'text-neutral-900 dark:text-neutral-50'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 dark:text-neutral-400">
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {internalOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`relative cursor-pointer select-none py-2.5 pl-4 pr-9 transition-colors ${
                  String(option.value) === String(value)
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-accent font-medium'
                    : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <span className="block truncate">
                  {option.label}
                </span>
                
                {String(option.value) === String(value) && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-accent">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500 mt-2">
          {helperText}
        </p>
      )}
    </div>
  );
}
