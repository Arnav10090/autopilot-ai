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
  const [showCopied, setShowCopied] = useState(false);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleCopyAll = () => {
    const text = risks
      .map((risk, index) => `${index + 1}. ${risk.risk}\n   Severity: ${risk.severity}\n   Mitigation: ${risk.mitigation}`)
      .join('\n\n');
    const fullText = `Risk Analysis\n${'='.repeat(13)}\n\n${text}`;
    navigator.clipboard.writeText(fullText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            Risk Analysis
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Potential risks and mitigation strategies identified
          </p>
        </div>
        {risks.length > 0 && (
          <div className="relative flex-shrink-0">
            {/* Copied notification */}
            {showCopied && (
              <div className="absolute -top-14 right-0 bg-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-50 flex items-center gap-2 animate-fade-in-up">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </div>
            )}
            <button
              onClick={handleCopyAll}
              className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Copy all risks"
            >
              📋
            </button>
          </div>
        )}
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
