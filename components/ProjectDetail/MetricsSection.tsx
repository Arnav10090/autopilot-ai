import { Card, CardBody } from '@/components/ui/Card';
import { MetricsCard } from '@/components/ProjectDetail/MetricsCard';

interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  sparkline?: number[];
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
}

interface MetricsSectionProps {
  metrics: MetricData[];
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
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
            <MetricsCard
              key={index}
              label={metric.label}
              value={metric.value}
              unit={metric.unit}
              change={metric.change}
              sparkline={metric.sparkline}
              color={metric.color}
            />
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
