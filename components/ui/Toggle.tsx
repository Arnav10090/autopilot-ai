import React, { useState } from 'react';

interface ToggleProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (enabled: boolean) => void;
  disabled?: boolean;
}

export function Toggle({
  label,
  description,
  defaultChecked = false,
  onChange,
  disabled = false,
}: ToggleProps) {
  const [enabled, setEnabled] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !enabled;
    setEnabled(newState);
    onChange?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      className="w-full flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-pressed={enabled}
      type="button"
    >
      <div>
        <p className="font-medium text-neutral-900 dark:text-neutral-50">{label}</p>
        {description && <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
      </div>
      <div
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
          enabled ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </button>
  );
}
