'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RequirementsCard } from '@/components/ProjectDetail/RequirementsCard';

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
  onComment?: (requirementId: string) => void;
}

export function RequirementsSection({
  functional,
  nonFunctional,
  assumptions,
  missing,
  onComment,
}: RequirementsSectionProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyItem = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopySection = (items: Requirement[], sectionName: string) => {
    const text = items.map((item, index) => `${index + 1}. ${item.text}`).join('\n');
    const fullText = `${sectionName}\n${'='.repeat(sectionName.length)}\n\n${text}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    const sections = [
      { name: 'Functional Requirements', items: functional },
      { name: 'Non-Functional Requirements', items: nonFunctional },
      { name: 'Assumptions', items: assumptions },
      { name: 'Missing Information', items: missing }
    ];

    const text = sections
      .filter(section => section.items.length > 0)
      .map(section => {
        const itemsText = section.items.map((item, idx) => `${idx + 1}. ${item.text}`).join('\n');
        return `${section.name}\n${'='.repeat(section.name.length)}\n\n${itemsText}`;
      })
      .join('\n\n');

    const fullText = `Requirements Analysis\n${'='.repeat(20)}\n\n${text}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-4">
          Requirements Analysis
        </h2>
        <div className="relative flex-shrink-0">
          {copiedSection === 'all' && (
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
            title="Copy all requirements"
          >
            📋
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Functional Requirements */}
        <Card>
          <CardHeader
            title="Functional Requirements"
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  {copiedSection === 'Functional Requirements' && (
                    <div className="absolute -top-14 right-0 bg-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-50 flex items-center gap-2 animate-fade-in-up">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleCopySection(functional, 'Functional Requirements')}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                    title="Copy all functional requirements"
                  >
                    📋
                  </button>
                </div>
                <Badge variant="info">{functional.length}</Badge>
              </div>
            }
          />
          <CardBody className="space-y-3">
            {functional.length > 0 ? (
              functional.map((req) => (
                <RequirementsCard
                  key={req.id}
                  text={req.text}
                  onCopy={() => handleCopyItem(req.text)}
                />
              ))
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
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  {copiedSection === 'Non-Functional Requirements' && (
                    <div className="absolute -top-14 right-0 bg-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-50 flex items-center gap-2 animate-fade-in-up">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleCopySection(nonFunctional, 'Non-Functional Requirements')}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                    title="Copy all non-functional requirements"
                  >
                    📋
                  </button>
                </div>
                <Badge variant="warning">{nonFunctional.length}</Badge>
              </div>
            }
          />
          <CardBody className="space-y-3">
            {nonFunctional.length > 0 ? (
              nonFunctional.map((req) => (
                <RequirementsCard
                  key={req.id}
                  text={req.text}
                  onCopy={() => handleCopyItem(req.text)}
                />
              ))
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 py-6 text-center">
                No non-functional requirements found.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Assumptions */}
        <Card>
          <CardHeader
            title="Assumptions"
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  {copiedSection === 'Assumptions' && (
                    <div className="absolute -top-14 right-0 bg-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-50 flex items-center gap-2 animate-fade-in-up">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleCopySection(assumptions, 'Assumptions')}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                    title="Copy all assumptions"
                  >
                    📋
                  </button>
                </div>
                <Badge variant="info">{assumptions.length}</Badge>
              </div>
            }
          />
          <CardBody className="space-y-3">
            {assumptions.length > 0 ? (
              assumptions.map((req) => (
                <RequirementsCard
                  key={req.id}
                  text={req.text}
                  onCopy={() => handleCopyItem(req.text)}
                />
              ))
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
              action={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {copiedSection === 'Missing Information' && (
                      <div className="absolute -top-14 right-0 bg-accent text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-50 flex items-center gap-2 animate-fade-in-up">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleCopySection(missing, 'Missing Information')}
                      className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                      title="Copy all missing information"
                    >
                      📋
                    </button>
                  </div>
                  <Badge variant="danger">{missing.length}</Badge>
                </div>
              }
            />
            <CardBody className="space-y-3">
              {missing.map((req) => (
                <RequirementsCard
                  key={req.id}
                  text={req.text}
                  onCopy={() => handleCopyItem(req.text)}
                />
              ))}
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
