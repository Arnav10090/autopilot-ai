'use client';

interface RequirementsCardProps {
  text: string;
  onCopy?: () => void;
  onEdit?: () => void;
  onComment?: () => void;
}

export function RequirementsCard({ text, onCopy, onEdit, onComment }: RequirementsCardProps) {
  return (
    <div className="border-l-4 border-accent pl-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition-colors">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
          {text}
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            aria-label="Copy"
            onClick={onCopy}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            title="Copy"
          >
            📋
          </button>
          <button
            aria-label="Edit"
            onClick={onEdit}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          {onComment && (
            <button
              aria-label="Comment"
              onClick={onComment}
              className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Comment"
            >
              💬
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
