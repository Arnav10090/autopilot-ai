'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  onExport: (format: string, options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  includeRequirements: boolean;
  includeTechStack: boolean;
  includeRisks: boolean;
  includeMetrics: boolean;
  includeNotes: boolean;
  format: string;
}

export function ExportModal({
  isOpen,
  onClose,
  projectTitle,
  onExport,
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [selectedOptions, setSelectedOptions] = useState<ExportOptions>({
    includeRequirements: true,
    includeTechStack: true,
    includeRisks: true,
    includeMetrics: true,
    includeNotes: true,
    format: 'pdf',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOption = (key: keyof Omit<ExportOptions, 'format'>) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await onExport(selectedFormat, {
        ...selectedOptions,
        format: selectedFormat,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats = [
    { id: 'pdf', label: 'PDF', description: 'Best for sharing and printing', icon: '📄' },
    { id: 'docx', label: 'Word', description: 'Editable document format', icon: '📝' },
    { id: 'csv', label: 'CSV', description: 'Data export format', icon: '📊' },
    { id: 'json', label: 'JSON', description: 'Structured data format', icon: '{}' },
    { id: 'markdown', label: 'Markdown', description: 'Plain text with formatting', icon: '📋' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Project"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || !selectedFormat}>
            {isExporting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Exporting...
              </>
            ) : (
              <>📥 Export</>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Format Selection */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-50">Export Format</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedFormat === format.id
                    ? 'border-accent bg-accent/5'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-accent/50'
                }`}
              >
                <div className="text-2xl mb-2">{format.icon}</div>
                <p className="font-medium text-neutral-900 dark:text-neutral-50">{format.label}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{format.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
              Include Sections
            </h3>
            <Badge variant="info">Optional</Badge>
          </div>
          <div className="space-y-2">
            {[
              {
                key: 'includeRequirements' as const,
                label: 'Requirements Analysis',
                description: 'Functional, non-functional, and assumptions',
              },
              {
                key: 'includeTechStack' as const,
                label: 'Tech Stack Recommendations',
                description: 'Technologies and reasoning',
              },
              {
                key: 'includeRisks' as const,
                label: 'Risk Analysis',
                description: 'Identified risks and mitigations',
              },
              {
                key: 'includeMetrics' as const,
                label: 'Metrics & Performance',
                description: 'KPIs and analysis metrics',
              },
              {
                key: 'includeNotes' as const,
                label: 'Notes & Attachments',
                description: 'Your notes and uploaded files',
              },
            ].map((section) => (
              <label key={section.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedOptions[section.key]}
                  onChange={() => toggleOption(section.key)}
                  className="mt-1 w-4 h-4 rounded accent-accent"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">
                    {section.label}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {section.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* File Info */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            <strong>File name:</strong> {projectTitle.replace(/\s+/g, '-').toLowerCase()}.{selectedFormat}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
