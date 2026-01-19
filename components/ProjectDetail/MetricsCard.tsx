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
  color = 'accent',
}: MetricsCardProps) {
  const getChangeColor = (change: number | undefined) => {
    if (!change) return 'text-neutral-500';
    return change > 0 ? 'text-emerald-400' : 'text-red-400';
  };

  const colorConfig = {
    accent: {
      bg: 'from-indigo-500/20 to-indigo-500/5',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/20',
      dot: 'bg-indigo-500',
    },
    info: {
      bg: 'from-cyan-500/20 to-cyan-500/5',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      dot: 'bg-cyan-500',
    },
    success: {
      bg: 'from-emerald-500/20 to-emerald-500/5',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    warning: {
      bg: 'from-amber-500/20 to-amber-500/5',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      dot: 'bg-amber-500',
    },
    danger: {
      bg: 'from-red-500/20 to-red-500/5',
      text: 'text-red-400',
      glow: 'shadow-red-500/20',
      dot: 'bg-red-500',
    },
  };

  const config = colorConfig[color];

  return (
    <Card isHoverable className={`overflow-hidden relative`}>
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} pointer-events-none`} />
      
      <CardBody className="space-y-4 relative z-10">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-neutral-400">{label}</p>
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-lg ${config.glow}`}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className={`text-4xl font-display font-700 ${config.text} animate-count`}>
              {value}
            </p>
            {unit && (
              <p className="text-sm text-neutral-500">{unit}</p>
            )}
          </div>

          {change !== undefined && (
            <p className={`text-sm font-medium flex items-center gap-1 ${getChangeColor(change)}`}>
              <span className={`${change > 0 ? 'rotate-0' : 'rotate-180'}`}>↑</span>
              {Math.abs(change)}% from last analysis
            </p>
          )}
        </div>

        {/* Mini sparkline */}
        {sparkline && sparkline.length > 0 && (
          <div className="pt-3 border-t border-neutral-800/50">
            <svg className="w-full h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <polyline
                points={sparkline
                  .map((v, i) => `${(i / (sparkline.length - 1)) * 100},${40 - v * 0.4}`)
                  .join(' ')}
                fill="none"
                stroke={`url(#gradient-${color})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
