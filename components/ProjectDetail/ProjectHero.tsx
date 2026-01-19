import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

interface ProjectHeroProps {
  title: string;
  id: string | number;
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
    <div className="relative overflow-hidden rounded-2xl border border-accent/20 dark:border-indigo-500/20 bg-white dark:bg-neutral-900/50 backdrop-blur-xl p-8 mb-8 shadow-lg">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
      
      {/* Animated orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 relative z-10">
        {/* Left content */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-4">
                <span className="gradient-text">{title}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <code className="bg-neutral-100 dark:bg-neutral-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700/50">
                  #{String(id)}
                </code>
                <Badge variant={statusConfig[status.toLowerCase()]} pulse>
                  {status}
                </Badge>
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Tooltip content="Regenerate analysis">
            <Button
              variant="outline"
              onClick={onRegenerateClick}
              aria-label="Regenerate analysis"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </Button>
          </Tooltip>
          <Tooltip content="Export project">
            <Button
              variant="outline"
              onClick={onExportClick}
              aria-label="Export project"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </Button>
          </Tooltip>
          <Tooltip content="Share project">
            <Button
              variant="outline"
              onClick={onShareClick}
              aria-label="Share project"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
