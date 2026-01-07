'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

export function Tooltip({ content, position = 'top', children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-900 dark:border-t-neutral-700',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-neutral-900 dark:border-r-neutral-700',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-neutral-900 dark:border-b-neutral-700',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-neutral-900 dark:border-l-neutral-700',
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-700 rounded-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}
