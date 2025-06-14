
import React, { useState } from 'react';
import { ReportInputForm } from './ReportInputForm';
import { ReportPreview } from './ReportPreview';
import { ReportConfig, GeneratedReport } from '@/lib/report-types';

type Step = 'input' | 'preview';

export function ReportGeneratorApp() {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);

  const handleReportGenerated = (report: GeneratedReport) => {
    setGeneratedReport(report);
    setCurrentStep('preview');
  };

  const handleBackToInput = () => {
    setCurrentStep('input');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {currentStep === 'input' && (
        <ReportInputForm onReportGenerated={handleReportGenerated} />
      )}
      
      {currentStep === 'preview' && generatedReport && (
        <ReportPreview 
          report={generatedReport} 
          onBack={handleBackToInput}
        />
      )}
    </div>
  );
}
