'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { TechTile } from '@/components/ProjectDetail/TechTile';

interface TechRecommendation {
  id: string;
  category: string;
  choice: string;
  reason: string;
  confidence: number;
  icon?: string;
}

interface TechStackSectionProps {
  recommendations: TechRecommendation[];
}

export function TechStackSection({ recommendations }: TechStackSectionProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyAll = () => {
    const text = recommendations
      .map((rec, index) => `${index + 1}. ${rec.category}: ${rec.choice}\n   Reason: ${rec.reason}`)
      .join('\n\n');
    const fullText = `Tech Stack Recommendations\n${'='.repeat(28)}\n\n${text}`;
    navigator.clipboard.writeText(fullText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            Tech Stack Recommendations
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            AI-powered recommendations tailored to your project requirements and constraints
          </p>
        </div>
        {recommendations.length > 0 && (
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
              title="Copy all tech stack recommendations"
            >
              📋
            </button>
          </div>
        )}
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <TechTile
              key={rec.id}
              category={rec.category}
              choice={rec.choice}
              reason={rec.reason}
              confidence={rec.confidence}
              icon={rec.icon}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardBody className="space-y-3">
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              No tech stack recommendations available
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Regenerate the analysis with more detailed project requirements
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
