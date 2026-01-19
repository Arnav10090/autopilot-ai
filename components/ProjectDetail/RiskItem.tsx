'use client';

import { Badge } from '@/components/ui/Badge';

interface RiskItemProps {
  risk: string;
  severity: 'Low' | 'Medium' | 'High';
  mitigation: string;
  impact: string;
  isExpanded: boolean;
  onToggle: () => void;
  onMitigate?: () => void;
  onComment?: () => void;
}

export function RiskItem({
  risk,
  severity,
  mitigation,
  impact,
  isExpanded,
  onToggle,
  onMitigate,
  onComment,
}: RiskItemProps) {
  const severityConfig = {
    Low: {
      badge: 'success' as const,
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/30',
      glow: 'hover:shadow-emerald-500/10',
      indicator: 'bg-emerald-500',
    },
    Medium: {
      badge: 'warning' as const,
      bg: 'from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/30',
      glow: 'hover:shadow-amber-500/10',
      indicator: 'bg-amber-500',
    },
    High: {
      badge: 'danger' as const,
      bg: 'from-red-500/10 to-red-500/5',
      border: 'border-red-500/30',
      glow: 'hover:shadow-red-500/10',
      indicator: 'bg-red-500',
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${config.border} bg-white dark:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 ${config.glow} hover:shadow-xl ${
        isExpanded ? 'ring-2 ring-accent/30 dark:ring-indigo-500/30' : ''
      }`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} pointer-events-none`} />
      
      {/* Severity indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.indicator}`} />

      <button
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full text-left p-5 pl-6 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 relative z-10"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">
              {risk}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="text-neutral-500">Impact:</span> {impact}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge variant={config.badge}>{severity}</Badge>
            <span className={`text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </button>

      {/* Expandable mitigation */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-neutral-200 dark:border-neutral-800/50 px-6 py-5 bg-neutral-50 dark:bg-neutral-900/30 relative z-10">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Mitigation Strategy
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{mitigation}</p>
            </div>

            <div className="flex gap-3 pt-2">
              {onMitigate && (
                <button
                  aria-label="Mitigate risk"
                  onClick={onMitigate}
                  className="text-xs px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all font-medium border border-emerald-500/20 hover:border-emerald-500/30 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Mitigated
                </button>
              )}
              {onComment && (
                <button
                  aria-label="Add comment"
                  onClick={onComment}
                  className="text-xs px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all font-medium border border-indigo-500/20 hover:border-indigo-500/30 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
