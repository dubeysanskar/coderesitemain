
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JDAnalyzer } from "./JDAnalyzer";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { ADSOptimizer } from "./ADSOptimizer";
import { ResumeData, JDAnalysis } from "@/lib/resume-types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeBuilderApp() {
  const [currentStep, setCurrentStep] = useState<'jd' | 'form' | 'preview' | 'optimize'>('jd');
  const [jdAnalysis, setJDAnalysis] = useState<JDAnalysis | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [adsScore, setAdsScore] = useState<number | null>(null);
  const { toast } = useToast();

  const handleJDAnalyzed = (analysis: JDAnalysis) => {
    setJDAnalysis(analysis);
    setCurrentStep('form');
    toast({
      title: "Job Description Analyzed",
      description: "AI has extracted key insights. Now build your resume!"
    });
  };

  const handleResumeCreated = (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep('preview');
    toast({
      title: "Resume Created",
      description: "Your resume is ready for preview and optimization!"
    });
  };

  const handleOptimizeResume = () => {
    setCurrentStep('optimize');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-8">
          <TabsTrigger value="jd" disabled={currentStep === 'jd'} className="text-white">
            1. Analyze JD
          </TabsTrigger>
          <TabsTrigger value="form" disabled={!jdAnalysis} className="text-white">
            2. Build Resume
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!resumeData} className="text-white">
            3. Preview
          </TabsTrigger>
          <TabsTrigger value="optimize" disabled={!resumeData} className="text-white">
            4. Optimize
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="jd" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JDAnalyzer onAnalyzed={handleJDAnalyzed} />
            </motion.div>
          </TabsContent>

          <TabsContent value="form" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResumeForm 
                jdAnalysis={jdAnalysis!}
                onResumeCreated={handleResumeCreated}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResumePreview 
                resumeData={resumeData!}
                onOptimize={handleOptimizeResume}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="optimize" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ADSOptimizer 
                resumeData={resumeData!}
                jdAnalysis={jdAnalysis!}
                onOptimized={setResumeData}
              />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
