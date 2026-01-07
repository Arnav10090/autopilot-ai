'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { RiskItem } from '@/components/ProjectDetail/RiskItem';

interface Risk {
  id: string;
  risk: string;
  severity: 'Low' | 'Medium' | 'High';
  mitigation: string;
  impact: string;
}

interface RiskSectionProps {
  risks: Risk[];
  onComment?: (riskId: string) => void;
  onMitigate?: (riskId: string) => void;
}

export function RiskSection({ risks, onComment, onMitigate }: RiskSectionProps) {
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
            <RiskItem
              key={risk.id}
              risk={risk.risk}
              severity={risk.severity}
              mitigation={risk.mitigation}
              impact={risk.impact}
              isExpanded={expandedIds.has(risk.id)}
              onToggle={() => toggleExpanded(risk.id)}
              onMitigate={() => onMitigate?.(risk.id)}
              onComment={() => onComment?.(risk.id)}
            />
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
