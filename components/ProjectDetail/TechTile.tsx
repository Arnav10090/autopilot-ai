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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      frontend: '🎨',
      backend: '⚙️',
      database: '🗄️',
      deployment: '🚀',
      default: '🔧',
    };
    return icon || icons[category.toLowerCase()] || icons.default;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/50 backdrop-blur-xl transition-all duration-300 shadow-sm ${
        isHovered ? 'shadow-xl shadow-accent/10 dark:shadow-indigo-500/10 -translate-y-1 border-accent/30 dark:border-indigo-500/30' : ''
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`} />
      
      <div className="space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="default" size="sm">{category}</Badge>
            <h3 className="font-display font-700 text-xl text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              {choice}
            </h3>
          </div>
          
          {/* Glowing confidence indicator */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
            confidence >= 4 ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20' :
            confidence >= 3 ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20' :
            'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20'
          }`}>
            {confidence.toFixed(1)}
          </div>
        </div>

        {/* Reason */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{reason}</p>

        {/* Confidence bar */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500">Confidence</span>
            <Badge variant={getConfidenceColor(confidence) as any} size="sm">
              {confidence.toFixed(1)}/5
            </Badge>
          </div>
          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full progress-gradient rounded-full transition-all duration-500"
              style={{ width: `${(confidence / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
