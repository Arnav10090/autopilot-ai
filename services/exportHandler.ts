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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';
import { saveAs } from 'file-saver';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

/**
 * Generate CSV format
 */
export function generateCSV(data: ExportData): string {
  // ... items existing CSV logic ...
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
 * Generate PDF format
 */
export function generatePDF(data: ExportData): void {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(33, 33, 33);
  doc.text(data.title, 14, 20);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Project ID: ${data.id}`, 14, 28);
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 14, 33);
  doc.text(`Status: ${data.status}`, 14, 38);

  let currentY = 45;

  // Metrics Section
  if (data.metrics && data.metrics.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Metrics', 14, currentY);
    currentY += 6;

    const metricsData = data.metrics.map(m => [m.label, `${m.value} ${m.unit || ''}`]);

    autoTable(doc, {
      startY: currentY,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // Blue accent
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Requirements Section
  if (data.requirements) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Requirements Analysis', 14, currentY);
    currentY += 6;

    const reqData = [
      ...data.requirements.functional.map(r => ['Functional', r]),
      ...data.requirements.nonFunctional.map(r => ['Non-Functional', r]),
      ...data.requirements.assumptions.map(r => ['Assumption', r]),
    ];

    if (reqData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Type', 'Requirement']],
        body: reqData,
        theme: 'striped',
        headStyles: { fillColor: [75, 85, 99] }, // Gray
        columnStyles: { 0: { cellWidth: 40 } },
        margin: { left: 14, right: 14 },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }
  }

  // Tech Stack Section
  if (data.techStack && data.techStack.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    doc.text('Tech Stack Recommendations', 14, currentY);
    currentY += 6;

    const techData = data.techStack.map(t => [t.category, t.choice, t.reason]);

    autoTable(doc, {
      startY: currentY,
      head: [['Category', 'Choice', 'Reasoning']],
      body: techData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Green
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 40 } },
      margin: { left: 14, right: 14 },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Risks Section
  if (data.risks && data.risks.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    doc.text('Risk Analysis', 14, currentY);
    currentY += 6;

    const riskData = data.risks.map(r => [r.risk, r.severity, r.mitigation]);

    autoTable(doc, {
      startY: currentY,
      head: [['Risk', 'Severity', 'Mitigation']],
      body: riskData,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] }, // Red
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 25 } },
      margin: { left: 14, right: 14 },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Notes
  if (data.notes) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    doc.text('Notes', 14, currentY);
    currentY += 6;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 28);
    doc.text(splitNotes, 14, currentY);
  }

  doc.save(`${data.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

/**
 * Generate Word format
 */
export async function generateWord(data: ExportData): Promise<void> {
  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: data.title,
      heading: HeadingLevel.TITLE,
    })
  );

  // Metadata
  children.push(new Paragraph({ text: `Project ID: ${data.id}`, spacing: { after: 100 } }));
  children.push(new Paragraph({ text: `Status: ${data.status}`, spacing: { after: 100 } }));
  children.push(new Paragraph({ text: `Date: ${new Date(data.createdAt).toLocaleDateString()}`, spacing: { after: 400 } }));

  // Metrics
  if (data.metrics && data.metrics.length > 0) {
    children.push(new Paragraph({ text: "Key Metrics", heading: HeadingLevel.HEADING_1 }));

    const metricRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "Metric" })], width: { size: 50, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("Value")], width: { size: 50, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...data.metrics.map(m => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(m.label)] }),
          new TableCell({ children: [new Paragraph(`${m.value} ${m.unit || ''}`)] }),
        ],
      }))
    ];

    children.push(new Table({
      rows: metricRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      }
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // Requirements
  if (data.requirements) {
    children.push(new Paragraph({ text: "Requirements Analysis", heading: HeadingLevel.HEADING_1 }));

    const allReqs = [
      ...data.requirements.functional.map(r => ({ type: 'Functional', text: r })),
      ...data.requirements.nonFunctional.map(r => ({ type: 'Non-Functional', text: r })),
      ...data.requirements.assumptions.map(r => ({ type: 'Assumption', text: r })),
    ];

    if (allReqs.length > 0) {
      const reqRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Requirement", bold: true })] })], width: { size: 70, type: WidthType.PERCENTAGE } }),
          ],
        }),
        ...allReqs.map(r => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(r.type)] }),
            new TableCell({ children: [new Paragraph(r.text)] }),
          ],
        }))
      ];

      children.push(new Table({
        rows: reqRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));
      children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    }
  }

  // Tech Stack
  if (data.techStack && data.techStack.length > 0) {
    children.push(new Paragraph({ text: "Tech Stack Recommendations", heading: HeadingLevel.HEADING_1 }));

    const techRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Choice", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Reason", bold: true })] })] }),
        ]
      }),
      ...data.techStack.map(t => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(t.category)] }),
          new TableCell({ children: [new Paragraph(t.choice)] }),
          new TableCell({ children: [new Paragraph(t.reason)] }),
        ],
      }))
    ];

    children.push(new Table({
      rows: techRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // Risks
  if (data.risks && data.risks.length > 0) {
    children.push(new Paragraph({ text: "Risk Analysis", heading: HeadingLevel.HEADING_1 }));

    const riskRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Risk", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Severity", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Mitigation", bold: true })] })] }),
        ]
      }),
      ...data.risks.map(r => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(r.risk)] }),
          new TableCell({ children: [new Paragraph(r.severity)] }),
          new TableCell({ children: [new Paragraph(r.mitigation)] }),
        ],
      }))
    ];

    children.push(new Table({
      rows: riskRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // Notes
  if (data.notes) {
    children.push(new Paragraph({ text: "Notes", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: data.notes }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title.replace(/\s+/g, '-').toLowerCase()}.docx`);
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
      downloadFile(content, filename, 'text/csv');
      break;
    case 'json':
      content = generateJSON(filteredData);
      downloadFile(content, filename, 'application/json');
      break;
    case 'markdown':
      content = generateMarkdown(filteredData);
      downloadFile(content, filename, 'text/markdown');
      break;
    case 'docx':
      await generateWord(filteredData);
      break;
    case 'pdf':
      generatePDF(filteredData);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
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
