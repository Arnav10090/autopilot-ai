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
  const severityConfig: Record<string, { badge: 'success' | 'warning' | 'danger'; bg: string }> = {
    'Low': { badge: 'success', bg: 'bg-success/5 border-success/30' },
    'Medium': { badge: 'warning', bg: 'bg-warning/5 border-warning/30' },
    'High': { badge: 'danger', bg: 'bg-danger/5 border-danger/30' },
  };

  const config = severityConfig[severity];

  return (
    <div
      className={`border-2 ${config.bg} rounded-lg transition-all ${
        isExpanded ? 'ring-2 ring-accent/30' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">
              {risk}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Impact:</strong> {impact}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge variant={config.badge}>{severity}</Badge>
            <span className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </button>

      {/* Expandable mitigation */}
      {isExpanded && (
        <div className="border-t-2 border-current border-opacity-10 px-5 py-4 bg-neutral-50/50 dark:bg-neutral-800/30 animate-slide-down">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                MITIGATION STRATEGY
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{mitigation}</p>
            </div>

            <div className="flex gap-2 pt-3">
              {onMitigate && (
                <button
                  aria-label="Mitigate risk"
                  onClick={onMitigate}
                  className="text-xs px-3 py-1.5 bg-success/10 text-success hover:bg-success/20 rounded transition-colors font-medium"
                >
                  ✓ Mark as Mitigated
                </button>
              )}
              {onComment && (
                <button
                  aria-label="Add comment"
                  onClick={onComment}
                  className="text-xs px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded transition-colors font-medium"
                >
                  💬 Comment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
