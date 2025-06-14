
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Brain } from "lucide-react";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { JDAnalysis } from "@/lib/resume-types";
import { useToast } from "@/hooks/use-toast";

interface JDAnalyzerProps {
  onAnalyzed: (analysis: JDAnalysis) => void;
}

export function JDAnalyzer({ onAnalyzed }: JDAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JDAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description to analyze.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAnalyzing(true);
      const result = await geminiResumeService.analyzeJobDescription(jobDescription);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Job description analyzed successfully!"
      });
    } catch (error) {
      console.error("JD Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (analysis) {
      onAnalyzed(analysis);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Description Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste the Job Description (JD) for the role you're applying to:
            </label>
            <Textarea
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={15}
              className="bg-gray-800 border-gray-600 text-white resize-none"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={analyzing || !jobDescription.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Job Description
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Key Skills Required:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keySkills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Tools & Technologies:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.tools.map((tool, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Industry Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.industryKeywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">AI-Suggested Summary:</h4>
              <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded">
                {analysis.suggestedSummary}
              </p>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Resume Builder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
