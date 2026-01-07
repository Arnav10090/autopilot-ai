'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

interface TechTileProps {
  category: string;
  choice: string;
  reason: string;
  confidence: number;
  icon?: string;
}

export function TechTile({ category, choice, reason, confidence, icon }: TechTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4.5) return 'success';
    if (confidence >= 3.5) return 'info';
    if (confidence >= 2.5) return 'warning';
    return 'danger';
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl transition-all duration-300 transform hover:border-accent/50 ${
        isHovered ? 'shadow-xl -translate-y-1' : ''
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <Badge variant="accent">{category}</Badge>
          <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50">
            {icon} {choice}
          </h3>
        </div>

        {/* Reason */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{reason}</p>

        {/* Confidence stars */}
        <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < Math.round(confidence) ? '⭐' : '☆'}`}
                aria-label={`${Math.round(confidence)} out of 5 stars`}
              />
            ))}
          </div>
          <Badge variant={getConfidenceColor(confidence) as any}>
            {confidence.toFixed(1)}/5
          </Badge>
        </div>
      </div>
    </div>
  );
}
