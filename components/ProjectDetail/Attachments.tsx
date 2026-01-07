'use client';

import { useRef, useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

interface AttachmentsProps {
  attachments: Attachment[];
  onUpload?: (files: File[]) => void;
  onDelete?: (attachmentId: string) => void;
  readonly?: boolean;
  maxFileSize?: number; // in bytes
}

const ACCEPTED_FORMATS = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function Attachments({
  attachments,
  onUpload,
  onDelete,
  readonly = false,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
}: AttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word')) return '📝';
    if (type.includes('sheet')) return '📊';
    if (type.includes('text')) return '📃';
    return '📎';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;

    setError(null);
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setError(`File type not supported: ${file.name}`);
        continue;
      }

      if (file.size > maxFileSize) {
        setError(`File too large: ${file.name} (max ${formatFileSize(maxFileSize)})`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setUploading(true);
      try {
        await onUpload?.(validFiles);
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!readonly && (
        <Card className="border-dashed border-2 border-neutral-200 dark:border-neutral-700">
          <CardBody className="py-8">
            <div
              className="text-center space-y-3 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-3xl">📤</p>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Supported: PDF, Images, Documents (max {formatFileSize(maxFileSize)})
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FORMATS.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Select Files'}
              </Button>
            </div>

            {error && (
              <p className="text-xs text-danger mt-3 text-center">{error}</p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Attachments List */}
      <div className="space-y-2">
        {attachments.length > 0 ? (
          <>
            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
            </h4>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">
                    {getFileIcon(attachment.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={attachment.url}
                      download={attachment.name}
                      className="text-sm font-medium text-accent hover:text-accent/80 truncate block"
                      title={attachment.name}
                    >
                      {attachment.name}
                    </a>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatFileSize(attachment.size)} • {attachment.uploadedBy} • {attachment.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {attachment.url && (
                    <a
                      href={attachment.url}
                      download={attachment.name}
                      className="text-neutral-400 hover:text-accent transition-colors"
                      title="Download"
                    >
                      ⬇️
                    </a>
                  )}
                  {!readonly && (
                    <button
                      aria-label="Delete attachment"
                      onClick={() => onDelete?.(attachment.id)}
                      className="text-neutral-400 hover:text-danger transition-colors"
                      title="Delete"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
            <p className="text-sm">
              {readonly
                ? 'No attachments'
                : 'No files attached yet. Upload documents to support your analysis.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
