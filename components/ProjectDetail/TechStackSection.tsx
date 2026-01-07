'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TechRecommendation {
  id: string;
  category: string;
  choice: string;
  reason: string;
  confidence: number; // 0-5
  icon?: string;
}

interface TechStackSectionProps {
  recommendations: TechRecommendation[];
}

export function TechStackSection({ recommendations }: TechStackSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4.5) return 'success';
    if (confidence >= 3.5) return 'info';
    if (confidence >= 2.5) return 'warning';
    return 'danger';
  };

  const TechTile = ({ rec }: { rec: TechRecommendation }) => {
    const isHovered = hoveredId === rec.id;

    return (
      <div
        key={rec.id}
        onMouseEnter={() => setHoveredId(rec.id)}
        onMouseLeave={() => setHoveredId(null)}
        className={`p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl transition-all duration-300 transform hover:border-accent/50 ${
          isHovered ? 'shadow-xl -translate-y-1' : ''
        }`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <Badge variant="accent">{rec.category}</Badge>
            <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50">
              {rec.icon} {rec.choice}
            </h3>
          </div>

          {/* Reason */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{rec.reason}</p>

          {/* Confidence stars */}
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < Math.round(rec.confidence) ? '⭐' : '☆'}`}
                  aria-label={`${Math.round(rec.confidence)} out of 5 stars`}
                />
              ))}
            </div>
            <Badge variant={getConfidenceColor(rec.confidence)}>
              {rec.confidence.toFixed(1)}/5
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
          Tech Stack Recommendations
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          AI-powered recommendations tailored to your project requirements and constraints
        </p>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <TechTile key={rec.id} rec={rec} />
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
