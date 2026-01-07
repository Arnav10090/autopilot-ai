import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { ThreeDAccent } from '@/components/ThreeDAccent';

interface ProjectHeroProps {
  title: string;
  id: string;
  status: string;
  createdAt: string;
  onRegenerateClick?: () => void;
  onExportClick?: () => void;
  onShareClick?: () => void;
}

const statusConfig: Record<string, 'success' | 'warning' | 'info'> = {
  completed: 'success',
  'in-progress': 'info',
  planning: 'warning',
};

export function ProjectHero({
  title,
  id,
  status,
  createdAt,
  onRegenerateClick,
  onExportClick,
  onShareClick,
}: ProjectHeroProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10 rounded-xl border border-accent/30 p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left content */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <code className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg font-mono">
                  {id}
                </code>
                <Badge variant={statusConfig[status.toLowerCase()]}>{status}</Badge>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Created {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex flex-wrap gap-3">
          <Tooltip content="Regenerate analysis">
            <Button
              variant="outline"
              onClick={onRegenerateClick}
              aria-label="Regenerate analysis"
            >
              🔄 Regenerate
            </Button>
          </Tooltip>
          <Tooltip content="Export project">
            <Button
              variant="outline"
              onClick={onExportClick}
              aria-label="Export project"
            >
              📥 Export
            </Button>
          </Tooltip>
          <Tooltip content="Share project">
            <Button
              variant="outline"
              onClick={onShareClick}
              aria-label="Share project"
            >
              🔗 Share
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
