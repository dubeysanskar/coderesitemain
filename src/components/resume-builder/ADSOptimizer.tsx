
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { ResumeData, JDAnalysis, ADSOptimization } from "@/lib/resume-types";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { useToast } from "@/hooks/use-toast";

interface ADSOptimizerProps {
  resumeData: ResumeData;
  jdAnalysis: JDAnalysis;
  onOptimized: (optimizedData: ResumeData) => void;
}

export function ADSOptimizer({ resumeData, jdAnalysis, onOptimized }: ADSOptimizerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [adsScore, setAdsScore] = useState<ADSOptimization | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    calculateADSScore();
  }, []);

  const calculateADSScore = async () => {
    try {
      setAnalyzing(true);
      const score = await geminiResumeService.calculateADSScore(resumeData, jdAnalysis);
      setAdsScore(score);
    } catch (error) {
      console.error("ADS calculation failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to calculate ADS score. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const optimizeResume = async () => {
    try {
      setOptimizing(true);
      const optimizedResume = await geminiResumeService.optimizeResume(resumeData, jdAnalysis);
      onOptimized(optimizedResume);
      
      // Recalculate score with optimized resume
      const newScore = await geminiResumeService.calculateADSScore(optimizedResume, jdAnalysis);
      setAdsScore(newScore);
      
      toast({
        title: "Resume Optimized",
        description: "Your resume has been enhanced with AI recommendations!"
      });
    } catch (error) {
      console.error("Optimization failed:", error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (analyzing) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
            <p className="text-white">Analyzing your resume against the job description...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ADS Score */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ATS Optimization Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {adsScore && (
            <>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(adsScore.score)} mb-2`}>
                  {adsScore.score}
                </div>
                <p className="text-gray-400">out of 100</p>
                <Progress 
                  value={adsScore.score} 
                  className="mt-4"
                  style={{
                    background: "rgba(75, 85, 99, 0.3)"
                  }}
                />
              </div>

              <div>
                <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {adsScore.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  AI Recommendations
                </h4>
                <ul className="space-y-2">
                  {adsScore.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={optimizeResume}
                disabled={optimizing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {optimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing Resume...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Apply AI Optimizations
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Optimization Preview */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI Optimization Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {adsScore?.improvedSections && (
            <>
              {adsScore.improvedSections.summary && (
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Improved Summary</h4>
                  <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
                    {adsScore.improvedSections.summary}
                  </div>
                </div>
              )}

              {adsScore.improvedSections.experience && (
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Enhanced Experience Points</h4>
                  <div className="bg-gray-800 p-3 rounded text-sm text-gray-300 space-y-2">
                    {adsScore.improvedSections.experience.map((exp, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {exp}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adsScore.improvedSections.skills && (
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Suggested Additional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {adsScore.improvedSections.skills.map((skill, index) => (
                      <Badge key={index} className="bg-green-600 text-white text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">How ATS Scoring Works</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Keyword matching: 40%</li>
              <li>• Skills alignment: 30%</li>
              <li>• Experience relevance: 20%</li>
              <li>• Format & structure: 10%</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
