
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Sparkles } from 'lucide-react';
import { ReportConfig, GeneratedReport, REPORT_TYPES, ACADEMIC_LEVELS, FONT_STYLES } from '@/lib/report-types';
import { geminiReportService } from '@/lib/gemini-report-service';
import { useToast } from '@/hooks/use-toast';

interface ReportInputFormProps {
  onReportGenerated: (report: GeneratedReport) => void;
}

export function ReportInputForm({ onReportGenerated }: ReportInputFormProps) {
  const [config, setConfig] = useState<ReportConfig>({
    title: '',
    subject: '',
    institution: '',
    authorName: '',
    wordCount: 1500,
    pageCount: 6,
    academicLevel: 'ug',
    reportType: '',
    customPrompts: '',
    fontStyle: 'times',
    layout: 'spacious'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [customReportType, setCustomReportType] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: keyof ReportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!config.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a report title.",
        variant: "destructive"
      });
      return false;
    }
    if (!config.subject.trim()) {
      toast({
        title: "Subject Required", 
        description: "Please enter a subject/topic.",
        variant: "destructive"
      });
      return false;
    }
    if (!config.authorName.trim()) {
      toast({
        title: "Author Name Required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return false;
    }
    if (!config.reportType) {
      toast({
        title: "Report Type Required",
        description: "Please select a report type.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const generateReport = async () => {
    if (!validateForm()) return;

    try {
      setIsGenerating(true);
      const finalConfig = {
        ...config,
        reportType: config.reportType === 'Custom' ? customReportType : config.reportType
      };
      
      const report = await geminiReportService.generateReport(finalConfig);
      onReportGenerated(report);
      
      toast({
        title: "Report Generated Successfully!",
        description: "Your academic report has been created."
      });
    } catch (error) {
      console.error('Report generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-green-400" />
            Report Generator
          </h1>
          <p className="text-gray-300 text-lg">
            Generate comprehensive academic reports with AI assistance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Report Title *</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your report title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-gray-300">Subject/Topic *</Label>
                <Input
                  id="subject"
                  value={config.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Main subject or topic"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="author" className="text-gray-300">Author Name *</Label>
                <Input
                  id="author"
                  value={config.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder="Your full name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="institution" className="text-gray-300">Institution/College (Optional)</Label>
                <Input
                  id="institution"
                  value={config.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  placeholder="Your institution name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Report Configuration */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Academic Level *</Label>
                <Select value={config.academicLevel} onValueChange={(value: any) => handleInputChange('academicLevel', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select academic level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Report Type *</Label>
                <Select value={config.reportType} onValueChange={(value) => handleInputChange('reportType', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {config.reportType === 'Custom' && (
                <div>
                  <Label htmlFor="customType" className="text-gray-300">Custom Report Type</Label>
                  <Input
                    id="customType"
                    value={customReportType}
                    onChange={(e) => setCustomReportType(e.target.value)}
                    placeholder="Enter custom report type"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wordCount" className="text-gray-300">Word Count</Label>
                  <Input
                    id="wordCount"
                    type="number"
                    value={config.wordCount}
                    onChange={(e) => handleInputChange('wordCount', parseInt(e.target.value) || 1500)}
                    min="500"
                    max="10000"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="pageCount" className="text-gray-300">Page Count</Label>
                  <Input
                    id="pageCount"
                    type="number"
                    value={config.pageCount}
                    onChange={(e) => handleInputChange('pageCount', parseInt(e.target.value) || 6)}
                    min="2"
                    max="50"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customization Options */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Customization & Additional Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customPrompts" className="text-gray-300">
                Specific Instructions (Optional)
              </Label>
              <Textarea
                id="customPrompts"
                value={config.customPrompts}
                onChange={(e) => handleInputChange('customPrompts', e.target.value)}
                placeholder="Provide specific points, instructions, structure, or data you want included..."
                rows={4}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Font Style</Label>
                <Select value={config.fontStyle} onValueChange={(value: any) => handleInputChange('fontStyle', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_STYLES.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Layout</Label>
                <Select value={config.layout} onValueChange={(value: any) => handleInputChange('layout', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={generateReport}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Report with AI
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
