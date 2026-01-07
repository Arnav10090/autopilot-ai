'use client';

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
