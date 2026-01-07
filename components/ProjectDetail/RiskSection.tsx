'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Risk {
  id: string;
  risk: string;
  severity: 'Low' | 'Medium' | 'High';
  mitigation: string;
  impact: string;
}

interface RiskSectionProps {
  risks: Risk[];
}

export function RiskSection({ risks }: RiskSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const severityConfig: Record<string, { badge: 'success' | 'warning' | 'danger'; bg: string }> = {
    'Low': { badge: 'success', bg: 'bg-success/5 border-success/30' },
    'Medium': { badge: 'warning', bg: 'bg-warning/5 border-warning/30' },
    'High': { badge: 'danger', bg: 'bg-danger/5 border-danger/30' },
  };

  const RiskItem = ({ risk }: { risk: Risk }) => {
    const isExpanded = expandedIds.has(risk.id);
    const config = severityConfig[risk.severity];

    return (
      <div
        key={risk.id}
        className={`border-2 ${config.bg} rounded-lg transition-all ${
          isExpanded ? 'ring-2 ring-accent/30' : ''
        }`}
      >
        <button
          onClick={() => toggleExpanded(risk.id)}
          className="w-full text-left p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">
                {risk.risk}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Impact:</strong> {risk.impact}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge variant={config.badge}>{risk.severity}</Badge>
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
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{risk.mitigation}</p>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  aria-label="Mitigate risk"
                  className="text-xs px-3 py-1.5 bg-success/10 text-success hover:bg-success/20 rounded transition-colors font-medium"
                >
                  ✓ Mark as Mitigated
                </button>
                <button
                  aria-label="Add comment"
                  className="text-xs px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded transition-colors font-medium"
                >
                  💬 Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
          Risk Analysis
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Potential risks and mitigation strategies identified
        </p>
      </div>

      {risks.length > 0 ? (
        <div className="space-y-3">
          {risks.map((risk) => (
            <RiskItem key={risk.id} risk={risk} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardBody className="space-y-3">
            <p className="text-lg font-medium text-success">✓ No risks identified</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This project appears to be well-planned with minimal risk exposure
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
