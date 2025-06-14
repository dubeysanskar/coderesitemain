
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, FileText, RefreshCw, Edit, Save, Copy, FileDown } from 'lucide-react';
import { GeneratedReport, ReportSection } from '@/lib/report-types';
import { geminiReportService } from '@/lib/gemini-report-service';
import { useToast } from '@/hooks/use-toast';

interface ReportPreviewProps {
  report: GeneratedReport;
  onBack: () => void;
}

export function ReportPreview({ report, onBack }: ReportPreviewProps) {
  const [sections, setSections] = useState<ReportSection[]>(report.sections);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const { toast } = useToast();

  const getFontClass = () => {
    switch (report.config.fontStyle) {
      case 'arial': return 'font-sans';
      case 'calibri': return 'font-sans';
      default: return 'font-serif';
    }
  };

  const getLayoutClass = () => {
    return report.config.layout === 'compact' ? 'space-y-4' : 'space-y-6';
  };

  const startEditing = (sectionId: string, content: string) => {
    setEditingSection(sectionId);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingSection) {
      setSections(prev => prev.map(section => 
        section.id === editingSection 
          ? { ...section, content: editContent }
          : section
      ));
      setEditingSection(null);
      setEditContent('');
      
      toast({
        title: "Section Updated",
        description: "Your changes have been saved."
      });
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditContent('');
  };

  const regenerateSection = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    try {
      setRegeneratingSection(sectionId);
      const newContent = await geminiReportService.regenerateSection(
        sectionId, 
        section.title, 
        report.config, 
        section.content
      );
      
      setSections(prev => prev.map(s => 
        s.id === sectionId 
          ? { ...s, content: newContent }
          : s
      ));
      
      toast({
        title: "Section Regenerated",
        description: `${section.title} has been updated with new content.`
      });
    } catch (error) {
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate section. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRegeneratingSection(null);
    }
  };

  const copyToClipboard = async () => {
    const fullText = sections.map(section => 
      `${section.title}\n\n${section.content}\n\n`
    ).join('');
    
    try {
      await navigator.clipboard.writeText(fullText);
      toast({
        title: "Copied to Clipboard",
        description: "Report content has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = sections.map(section => 
        `<div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 15px; font-size: 1.5em; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            ${section.title}
          </h2>
          <div style="line-height: 1.6; white-space: pre-wrap;">
            ${section.content.replace(/\n/g, '<br>')}
          </div>
        </div>`
      ).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>${report.config.title}</title>
            <style>
              body { 
                font-family: ${report.config.fontStyle === 'times' ? 'Times New Roman, serif' : 'Arial, sans-serif'}; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 40px; 
                line-height: 1.6;
                color: #1f2937;
              }
              h1 { 
                text-align: center; 
                margin-bottom: 10px; 
                font-size: 2em;
                color: #111827;
              }
              .meta { 
                text-align: center; 
                margin-bottom: 40px; 
                color: #6b7280;
                font-style: italic;
              }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${report.config.title}</h1>
            <div class="meta">
              By: ${report.config.authorName}<br>
              ${report.config.institution ? `${report.config.institution}<br>` : ''}
              Subject: ${report.config.subject}
            </div>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadAsWord = () => {
    const content = sections.map(section => 
      `${section.title}\n\n${section.content}\n\n`
    ).join('');
    
    const header = `${report.config.title}\n\nBy: ${report.config.authorName}\n${report.config.institution ? `${report.config.institution}\n` : ''}Subject: ${report.config.subject}\n\n\n`;
    
    const fullContent = header + content;
    const blob = new Blob([fullContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.config.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="bg-white text-black hover:bg-gray-100"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              onClick={downloadAsPDF}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={downloadAsWord}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download DOCX
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <Card className="bg-white text-black">
          <CardHeader className="text-center border-b">
            <CardTitle className={`text-3xl mb-4 ${getFontClass()}`}>
              {report.config.title}
            </CardTitle>
            <div className="text-gray-600 space-y-1">
              <p>By: {report.config.authorName}</p>
              {report.config.institution && <p>{report.config.institution}</p>}
              <p>Subject: {report.config.subject}</p>
              <p className="text-sm">Generated on: {report.generatedAt.toLocaleDateString()}</p>
            </div>
          </CardHeader>
          
          <CardContent className={`p-8 ${getLayoutClass()}`}>
            {sections.map((section) => (
              <div key={section.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-semibold text-gray-800 ${getFontClass()}`}>
                    {section.title}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(section.id, section.content)}
                      disabled={editingSection === section.id}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => regenerateSection(section.id)}
                      disabled={regeneratingSection === section.id}
                    >
                      {regeneratingSection === section.id ? (
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 mr-1" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                {editingSection === section.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={8}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${getFontClass()}`}>
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
