
export interface ReportConfig {
  title: string;
  subject: string;
  institution?: string;
  authorName: string;
  wordCount: number;
  pageCount: number;
  academicLevel: 'school' | 'ug' | 'pg' | 'research';
  reportType: string;
  customPrompts?: string;
  fontStyle: 'times' | 'arial' | 'calibri';
  layout: 'compact' | 'spacious';
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

export interface GeneratedReport {
  config: ReportConfig;
  sections: ReportSection[];
  generatedAt: Date;
}

export const REPORT_TYPES = [
  'Lab Report',
  'Field Report', 
  'Research Summary',
  'Case Study',
  'Assignment Report',
  'Literature Review',
  'Technical Report',
  'Project Report',
  'Custom'
];

export const ACADEMIC_LEVELS = [
  { value: 'school', label: 'School Level' },
  { value: 'ug', label: 'Undergraduate' },
  { value: 'pg', label: 'Postgraduate' },
  { value: 'research', label: 'Research Level' }
];

export const FONT_STYLES = [
  { value: 'times', label: 'Times New Roman' },
  { value: 'arial', label: 'Arial' },
  { value: 'calibri', label: 'Calibri' }
];
