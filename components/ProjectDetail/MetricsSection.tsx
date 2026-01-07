import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  sparkline?: number[];
  color?: 'accent' | 'success' | 'warning' | 'danger';
}

interface MetricsSectionProps {
  metrics: MetricData[];
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const getChangeColor = (change: number | undefined) => {
    if (!change) return 'text-neutral-600 dark:text-neutral-400';
    return change > 0 ? 'text-success' : 'text-danger';
  };

  const MetricCard = ({ metric }: { metric: MetricData }) => (
    <Card isHoverable>
      <CardBody className="space-y-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{metric.label}</p>
          {metric.color && (
            <div
              className={`w-3 h-3 rounded-full bg-${metric.color}`}
              style={{
                backgroundColor: metric.color === 'accent' ? 'var(--accent)' :
                                metric.color === 'success' ? 'var(--success)' :
                                metric.color === 'warning' ? 'var(--warning)' :
                                'var(--danger)',
              }}
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-display font-700 text-neutral-900 dark:text-neutral-50">
              {metric.value}
            </p>
            {metric.unit && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{metric.unit}</p>
            )}
          </div>

          {metric.change !== undefined && (
            <p className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
              {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}% from last analysis
            </p>
          )}
        </div>

        {/* Mini sparkline */}
        {metric.sparkline && metric.sparkline.length > 0 && (
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <svg className="w-full h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline
                points={metric.sparkline
                  .map((v, i) => `${(i / (metric.sparkline!.length - 1)) * 100},${40 - v * 0.4}`)
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

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
          Metrics & Performance
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Key metrics from the AI analysis process
        </p>
      </div>

      {metrics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardBody className="space-y-3">
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              No metrics available
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Metrics will appear once the analysis is complete
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
