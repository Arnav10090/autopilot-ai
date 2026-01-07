/**
 * Export handler utilities for generating different file formats
 */

interface ExportData {
  title: string;
  id: string;
  status: string;
  createdAt: string;
  requirements?: {
    functional: string[];
    nonFunctional: string[];
    assumptions: string[];
    missing: string[];
  };
  techStack?: Array<{
    category: string;
    choice: string;
    reason: string;
    confidence: number;
  }>;
  risks?: Array<{
    risk: string;
    severity: string;
    mitigation: string;
    impact: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string | number;
    unit?: string;
  }>;
  notes?: string;
}

/**
 * Generate CSV format
 */
export function generateCSV(data: ExportData): string {
  const rows: string[][] = [];

  // Header
  rows.push(['Project Analysis Export']);
  rows.push([]);
  rows.push(['Project Information']);
  rows.push(['Title', data.title]);
  rows.push(['ID', data.id]);
  rows.push(['Status', data.status]);
  rows.push(['Created', data.createdAt]);
  rows.push([]);

  // Requirements
  if (data.requirements) {
    rows.push(['Requirements Analysis']);
    rows.push(['Type', 'Item']);

    if (data.requirements.functional.length > 0) {
      rows.push(['Functional Requirements']);
      data.requirements.functional.forEach((req) => rows.push(['', req]));
    }

    if (data.requirements.nonFunctional.length > 0) {
      rows.push(['Non-Functional Requirements']);
      data.requirements.nonFunctional.forEach((req) => rows.push(['', req]));
    }

    if (data.requirements.assumptions.length > 0) {
      rows.push(['Assumptions']);
      data.requirements.assumptions.forEach((req) => rows.push(['', req]));
    }

    rows.push([]);
  }

  // Tech Stack
  if (data.techStack && data.techStack.length > 0) {
    rows.push(['Tech Stack Recommendations']);
    rows.push(['Category', 'Choice', 'Reason', 'Confidence']);
    data.techStack.forEach((tech) => {
      rows.push([
        tech.category,
        tech.choice,
        tech.reason,
        tech.confidence.toString(),
      ]);
    });
    rows.push([]);
  }

  // Risks
  if (data.risks && data.risks.length > 0) {
    rows.push(['Risk Analysis']);
    rows.push(['Risk', 'Severity', 'Impact', 'Mitigation']);
    data.risks.forEach((risk) => {
      rows.push([risk.risk, risk.severity, risk.impact, risk.mitigation]);
    });
    rows.push([]);
  }

  // Metrics
  if (data.metrics && data.metrics.length > 0) {
    rows.push(['Metrics']);
    rows.push(['Metric', 'Value', 'Unit']);
    data.metrics.forEach((metric) => {
      rows.push([metric.label, metric.value.toString(), metric.unit || '']);
    });
    rows.push([]);
  }

  // Convert to CSV format
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

/**
 * Generate JSON format
 */
export function generateJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Generate Markdown format
 */
export function generateMarkdown(data: ExportData): string {
  const lines: string[] = [];

  lines.push(`# ${data.title}`);
  lines.push('');
  lines.push(`**Project ID:** \`${data.id}\``);
  lines.push(`**Status:** ${data.status}`);
  lines.push(`**Created:** ${new Date(data.createdAt).toLocaleDateString()}`);
  lines.push('');

  // Requirements
  if (data.requirements) {
    lines.push('## Requirements Analysis');
    lines.push('');

    if (data.requirements.functional.length > 0) {
      lines.push('### Functional Requirements');
      data.requirements.functional.forEach((req) => {
        lines.push(`- ${req}`);
      });
      lines.push('');
    }

    if (data.requirements.nonFunctional.length > 0) {
      lines.push('### Non-Functional Requirements');
      data.requirements.nonFunctional.forEach((req) => {
        lines.push(`- ${req}`);
      });
      lines.push('');
    }

    if (data.requirements.assumptions.length > 0) {
      lines.push('### Assumptions');
      data.requirements.assumptions.forEach((req) => {
        lines.push(`- ${req}`);
      });
      lines.push('');
    }
  }

  // Tech Stack
  if (data.techStack && data.techStack.length > 0) {
    lines.push('## Tech Stack Recommendations');
    lines.push('');
    data.techStack.forEach((tech) => {
      lines.push(`### ${tech.choice}`);
      lines.push(`**Category:** ${tech.category}`);
      lines.push(`**Reasoning:** ${tech.reason}`);
      lines.push(`**Confidence:** ${tech.confidence.toFixed(1)}/5`);
      lines.push('');
    });
  }

  // Risks
  if (data.risks && data.risks.length > 0) {
    lines.push('## Risk Analysis');
    lines.push('');
    data.risks.forEach((risk) => {
      lines.push(`### ${risk.risk}`);
      lines.push(`**Severity:** ${risk.severity}`);
      lines.push(`**Impact:** ${risk.impact}`);
      lines.push(`**Mitigation:** ${risk.mitigation}`);
      lines.push('');
    });
  }

  // Metrics
  if (data.metrics && data.metrics.length > 0) {
    lines.push('## Metrics');
    lines.push('');
    data.metrics.forEach((metric) => {
      const unit = metric.unit ? ` ${metric.unit}` : '';
      lines.push(`- **${metric.label}:** ${metric.value}${unit}`);
    });
    lines.push('');
  }

  // Notes
  if (data.notes) {
    lines.push('## Notes');
    lines.push('');
    lines.push(data.notes);
  }

  return lines.join('\n');
}

/**
 * Download file helper
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Main export function
 */
export async function exportProject(
  data: ExportData,
  format: string,
  options: {
    includeRequirements: boolean;
    includeTechStack: boolean;
    includeRisks: boolean;
    includeMetrics: boolean;
    includeNotes: boolean;
  }
): Promise<void> {
  // Filter data based on options
  const filteredData: ExportData = {
    title: data.title,
    id: data.id,
    status: data.status,
    createdAt: data.createdAt,
  };

  if (options.includeRequirements) {
    filteredData.requirements = data.requirements;
  }

  if (options.includeTechStack) {
    filteredData.techStack = data.techStack;
  }

  if (options.includeRisks) {
    filteredData.risks = data.risks;
  }

  if (options.includeMetrics) {
    filteredData.metrics = data.metrics;
  }

  if (options.includeNotes) {
    filteredData.notes = data.notes;
  }

  // Generate file based on format
  const filename = `${data.title.replace(/\s+/g, '-').toLowerCase()}.${format}`;
  let content: string;
  let mimeType: string = 'text/plain';

  switch (format.toLowerCase()) {
    case 'csv':
      content = generateCSV(filteredData);
      mimeType = 'text/csv';
      break;
    case 'json':
      content = generateJSON(filteredData);
      mimeType = 'application/json';
      break;
    case 'markdown':
      content = generateMarkdown(filteredData);
      mimeType = 'text/markdown';
      break;
    case 'docx':
      // For DOCX, we'll just generate a markdown representation
      // A full DOCX generator would require additional libraries
      content = generateMarkdown(filteredData);
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'pdf':
      // For PDF, we'll generate a markdown representation
      // A full PDF generator would require additional libraries like pdfkit
      content = generateMarkdown(filteredData);
      mimeType = 'application/pdf';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  downloadFile(content, filename, mimeType);
}

/**
 * Export analytics data
 */
export function exportAnalytics(
  data: Array<{
    timestamp: string;
    kpiValue: number;
    agentLatency: number;
    apiCalls: number;
  }>,
  format: string = 'csv'
): void {
  const filename = `analytics-${new Date().toISOString().split('T')[0]}.${format}`;
  let content: string;
  let mimeType: string = 'text/plain';

  if (format.toLowerCase() === 'csv') {
    const rows = [['Timestamp', 'KPI Value', 'Agent Latency', 'API Calls']];
    data.forEach((row) => {
      rows.push([row.timestamp, row.kpiValue.toString(), row.agentLatency.toString(), row.apiCalls.toString()]);
    });
    content = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    mimeType = 'text/csv';
  } else {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  }

  downloadFile(content, filename, mimeType);
}
