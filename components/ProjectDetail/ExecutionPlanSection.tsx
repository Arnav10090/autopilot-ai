'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Task {
  id: string;
  name: string;
  estimateDays: number;
  dependencies: string[];
  progress: number;
}

interface Module {
  id: string;
  name: string;
  tasks: Task[];
  estimateDays: number;
}

interface ExecutionPlanSectionProps {
  modules: Module[];
  onTaskReorder?: (moduleId: string, reorderedTasks: Task[]) => void;
}

export function ExecutionPlanSection({ modules, onTaskReorder }: ExecutionPlanSectionProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [draggedTask, setDraggedTask] = useState<{ moduleId: string; taskId: string } | null>(null);
  const [localModules, setLocalModules] = useState(modules);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedModules(newExpanded);
  };

  const handleDragStart = (moduleId: string, taskId: string, e: React.DragEvent) => {
    setDraggedTask({ moduleId, taskId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (moduleId: string, targetTaskId: string, e: React.DragEvent) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.moduleId !== moduleId) {
      return;
    }

    if (draggedTask.taskId === targetTaskId) {
      setDraggedTask(null);
      return;
    }

    // Reorder tasks within the module
    const updatedModules = localModules.map((m) => {
      if (m.id === moduleId) {
        const tasks = [...m.tasks];
        const draggedIndex = tasks.findIndex((t) => t.id === draggedTask.taskId);
        const targetIndex = tasks.findIndex((t) => t.id === targetTaskId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
          // Remove dragged task
          const [movedTask] = tasks.splice(draggedIndex, 1);
          // Insert at target position
          tasks.splice(targetIndex, 0, movedTask);

          onTaskReorder?.(moduleId, tasks);

          return { ...m, tasks };
        }
      }
      return m;
    });

    setLocalModules(updatedModules);
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const totalDays = localModules.reduce((sum, m) => sum + m.estimateDays, 0);
  const completedDays = localModules.reduce(
    (sum, m) =>
      sum +
      m.tasks.reduce((taskSum, t) => taskSum + (t.progress / 100) * t.estimateDays, 0),
    0
  );
  const overallProgress = Math.round((completedDays / totalDays) * 100);

  const TaskItem = ({ moduleId, task }: { moduleId: string; task: Task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(moduleId, task.id, e)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(moduleId, task.id, e)}
      onDragEnd={handleDragEnd}
      className={`py-3 px-4 border-l-4 border-accent/30 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-grab active:cursor-grabbing ${
        draggedTask?.taskId === task.id ? 'opacity-50 bg-accent/10' : ''
      }`}
      aria-grabbed={draggedTask?.taskId === task.id}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 cursor-grab active:cursor-grabbing flex-shrink-0" title="Drag to reorder">
              ⋮⋮
            </div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-50 flex-1 truncate">
              {task.name}
            </h4>
          </div>
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
          aria-expanded={isExpanded}
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
            {module.tasks.length > 0 ? (
              module.tasks.map((task) => (
                <TaskItem key={task.id} moduleId={module.id} task={task} />
              ))
            ) : (
              <div className="py-6 px-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                No tasks in this module
              </div>
            )}
            {module.tasks.length > 1 && (
              <div className="px-4 py-2 bg-neutral-50/50 dark:bg-neutral-800/50 text-xs text-neutral-600 dark:text-neutral-400">
                💡 Tip: Drag tasks to reorder them
              </div>
            )}
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

      {localModules.length > 0 ? (
        <div className="space-y-3">
          {localModules.map((module) => (
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
