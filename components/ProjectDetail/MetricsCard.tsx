'use client';

import { Card, CardBody } from '@/components/ui/Card';

interface MetricsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  sparkline?: number[];
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
}

export function MetricsCard({
  label,
  value,
  unit,
  change,
  sparkline,
  color,
}: MetricsCardProps) {
  const getChangeColor = (change: number | undefined) => {
    if (!change) return 'text-neutral-600 dark:text-neutral-400';
    return change > 0 ? 'text-success' : 'text-danger';
  };

  const getColorValue = (color: string | undefined) => {
    switch (color) {
      case 'accent':
        return 'var(--accent)';
      case 'success':
        return 'var(--success)';
      case 'warning':
        return 'var(--warning)';
      case 'danger':
        return 'var(--danger)';
      default:
        return 'var(--accent-2)';
    }
  };

  return (
    <Card isHoverable>
      <CardBody className="space-y-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
          {color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getColorValue(color),
              }}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-display font-700 text-neutral-900 dark:text-neutral-50">
              {value}
            </p>
            {unit && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{unit}</p>
            )}
          </div>

          {change !== undefined && (
            <p className={`text-sm font-medium ${getChangeColor(change)}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last analysis
            </p>
          )}
        </div>

        {/* Mini sparkline */}
        {sparkline && sparkline.length > 0 && (
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <svg className="w-full h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline
                points={sparkline
                  .map((v, i) => `${(i / (sparkline.length - 1)) * 100},${40 - v * 0.4}`)
                  .join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent"
              />
            </svg>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
