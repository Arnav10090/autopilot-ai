'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Task {
  id: string;
  name: string;
  estimateDays: number;
  dependencies: string[];
  progress: number; // 0-100
}

interface Module {
  id: string;
  name: string;
  tasks: Task[];
  estimateDays: number;
}

interface ExecutionPlanSectionProps {
  modules: Module[];
}

export function ExecutionPlanSection({ modules }: ExecutionPlanSectionProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedModules(newExpanded);
  };

  const totalDays = modules.reduce((sum, m) => sum + m.estimateDays, 0);
  const completedDays = modules.reduce(
    (sum, m) =>
      sum +
      m.tasks.reduce((taskSum, t) => taskSum + (t.progress / 100) * t.estimateDays, 0),
    0
  );
  const overallProgress = Math.round((completedDays / totalDays) * 100);

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="py-3 px-4 border-l-4 border-accent/30 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-50 flex-1">
            {task.name}
          </h4>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {task.estimateDays}d
            </span>
            <Badge variant="info" size="sm">
              {task.progress}%
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>

        {task.dependencies.length > 0 && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Depends on: {task.dependencies.join(', ')}
          </p>
        )}
      </div>
    </div>
  );

  const ModuleItem = ({ module }: { module: Module }) => {
    const isExpanded = expandedModules.has(module.id);

    return (
      <div key={module.id} className="border-2 border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleExpanded(module.id)}
          className="w-full text-left p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent bg-gradient-to-r from-accent/5 via-transparent to-accent-2/5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-display font-700 text-neutral-900 dark:text-neutral-50">
                {module.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {module.tasks.length} tasks • {module.estimateDays} days
              </p>
            </div>
            <span className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t-2 border-neutral-200 dark:border-neutral-700 divide-y divide-neutral-200 dark:divide-neutral-700 animate-slide-down">
            {module.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-4">
          Execution Plan
        </h2>

        {/* Overall progress */}
        <Card className="mb-6">
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Overall Progress</p>
                <p className="font-display font-700 text-2xl text-neutral-900 dark:text-neutral-50">
                  {overallProgress}% Complete
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {totalDays} days total
                </p>
                <p className="text-lg font-medium text-accent">
                  {Math.round(completedDays)} / {totalDays}
                </p>
              </div>
            </div>

            <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {modules.length > 0 ? (
        <div className="space-y-3">
          {modules.map((module) => (
            <ModuleItem key={module.id} module={module} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardBody className="space-y-3">
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              No execution plan available
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Regenerate the analysis to create a detailed execution plan
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
