import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AutoPilot AI Logo"
    >
      {/* Outer Glow/Ring (Subtle) */}
      <circle cx="16" cy="16" r="14" className="stroke-accent/20 dark:stroke-accent-2/20" strokeWidth="1" />
      
      {/* Main Shape: Stylized Plane / Arrow */}
      <path
        d="M6 16L14 19L26 6L17 26L14 19"
        className="fill-neutral-900 dark:fill-white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Accent Detail: Trajectory / tail */}
      <path
        d="M6 16L26 6"
        className="stroke-accent dark:stroke-accent-2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Tech Node: Connection point indicating AI */}
      <circle cx="26" cy="6" r="2" className="fill-accent dark:fill-accent-2 animate-pulse-subtle" />
    </svg>
  );
}
