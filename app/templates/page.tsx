'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const TEMPLATES = [
  {
    id: 1,
    name: 'Web Application',
    description: 'Standard web app template with frontend, backend, and database',
    category: 'Web',
    projects: 342,
    icon: '🌐',
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'Cross-platform mobile application template',
    category: 'Mobile',
    projects: 218,
    icon: '📱',
  },
  {
    id: 3,
    name: 'API Service',
    description: 'RESTful API and microservices template',
    category: 'Backend',
    projects: 156,
    icon: '⚙️',
  },
  {
    id: 4,
    name: 'Data Pipeline',
    description: 'ETL and data processing pipeline template',
    category: 'Data',
    projects: 89,
    icon: '📊',
  },
  {
    id: 5,
    name: 'Machine Learning',
    description: 'ML model development and deployment template',
    category: 'AI',
    projects: 145,
    icon: '🤖',
  },
  {
    id: 6,
    name: 'Desktop Application',
    description: 'Cross-platform desktop app template',
    category: 'Desktop',
    projects: 73,
    icon: '💻',
  },
];

export default function TemplatesPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
            Analysis Templates
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Use pre-built templates to quickly analyze common project types
          </p>
        </div>

        <div className="flex gap-2">
          {['All', 'Web', 'Mobile', 'Backend', 'Data', 'AI'].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template, i) => (
          <Card key={template.id} isHoverable className="animate-slide-up group overflow-hidden relative" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardBody className="space-y-4 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">{template.icon}</div>
                  <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50 group-hover:text-accent transition-colors duration-300">
                    {template.name}
                  </h3>
                </div>
                <Badge variant="accent">{template.category}</Badge>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {template.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Used in {template.projects} projects
                </span>
                <Link href={`/create?template=${template.id}`}>
                  <Button size="sm">Use Template</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
