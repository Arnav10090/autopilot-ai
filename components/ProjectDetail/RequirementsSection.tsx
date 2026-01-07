'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Requirement {
  id: string;
  text: string;
  category?: string;
}

interface RequirementsSectionProps {
  functional: Requirement[];
  nonFunctional: Requirement[];
  assumptions: Requirement[];
  missing: Requirement[];
}

export function RequirementsSection({
  functional,
  nonFunctional,
  assumptions,
  missing,
}: RequirementsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const RequirementCard = ({ requirement }: { requirement: Requirement }) => (
    <div className="border-l-4 border-accent pl-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
          {requirement.text}
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            aria-label="Copy"
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
          >
            📋
          </button>
          <button
            aria-label="Edit"
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
          >
            ✏️
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-4">
          Requirements Analysis
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Functional Requirements */}
        <Card>
          <CardHeader
            title="Functional Requirements"
            action={<Badge variant="accent">{functional.length}</Badge>}
          />
          <CardBody className="space-y-3">
            {functional.length > 0 ? (
              functional.map((req) => <RequirementCard key={req.id} requirement={req} />)
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 py-6 text-center">
                No functional requirements found. Try regenerating with more detail.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Non-Functional Requirements */}
        <Card>
          <CardHeader
            title="Non-Functional Requirements"
            action={<Badge variant="warning">{nonFunctional.length}</Badge>}
          />
          <CardBody className="space-y-3">
            {nonFunctional.length > 0 ? (
              nonFunctional.map((req) => <RequirementCard key={req.id} requirement={req} />)
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 py-6 text-center">
                No non-functional requirements found.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Assumptions */}
        <Card>
          <CardHeader title="Assumptions" action={<Badge variant="info">{assumptions.length}</Badge>} />
          <CardBody className="space-y-3">
            {assumptions.length > 0 ? (
              assumptions.map((req) => <RequirementCard key={req.id} requirement={req} />)
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 py-6 text-center">
                No assumptions identified.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Missing Information */}
        {missing.length > 0 && (
          <Card variant="elevated" className="border-warning/50 bg-warning/5">
            <CardHeader
              title="Missing Information"
              action={<Badge variant="danger">{missing.length}</Badge>}
            />
            <CardBody className="space-y-3">
              {missing.map((req) => <RequirementCard key={req.id} requirement={req} />)}
              <p className="text-xs text-warning mt-4 pt-3 border-t border-warning/30">
                💡 Provide more details to improve recommendations
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
