'use client';

import { useState } from 'react';

interface RequirementsCardProps {
  text: string;
  onCopy?: () => void;
}

export function RequirementsCard({ text, onCopy }: RequirementsCardProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.();
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="border-l-4 border-accent pl-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
          {text}
        </p>
        <div className="relative flex-shrink-0">
          {showCopied && (
            <div className="absolute -top-14 right-0 bg-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-50 flex items-center gap-2 animate-fade-in-up">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </div>
          )}
          <button
            aria-label="Copy"
            onClick={handleCopy}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            title="Copy"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
}
