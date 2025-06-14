
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, CheckCircle, AlertCircle, Zap, Download } from "lucide-react";
import { ResumeData, JDAnalysis, ADSOptimization } from "@/lib/resume-types";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { useToast } from "@/hooks/use-toast";

interface ADSOptimizerProps {
  resumeData: ResumeData;
  originalResumeData: ResumeData;
  jdAnalysis: JDAnalysis | null;
  onOptimized: (optimizedData: ResumeData) => void;
}

export function ADSOptimizer({ resumeData, originalResumeData, jdAnalysis, onOptimized }: ADSOptimizerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [adsScore, setAdsScore] = useState<ADSOptimization | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    calculateADSScore();
  }, [resumeData]);

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
      setIsOptimized(true);
      
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

  const downloadOriginalResume = () => {
    try {
      // Create a new window with the original resume content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked');
      }

      // Generate HTML content for original resume PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${originalResumeData.personalInfo.fullName} - Original Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Calibri', 'Arial', sans-serif; 
              font-size: 11pt; 
              line-height: 1.4; 
              color: #333; 
              background: white; 
              padding: 40px;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .name { font-size: 24pt; font-weight: bold; color: #2c3e50; margin-bottom: 8px; }
            .contact { font-size: 10pt; color: #666; margin-bottom: 4px; }
            .contact a { color: #2980b9; text-decoration: none; }
            .section { margin-bottom: 25px; }
            .section-title { 
              font-size: 14pt; 
              font-weight: bold; 
              color: #2c3e50; 
              border-bottom: 2px solid #3498db; 
              padding-bottom: 4px; 
              margin-bottom: 12px; 
              text-transform: uppercase;
            }
            .experience-item, .project-item, .achievement-item { margin-bottom: 15px; }
            .job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
            .job-title { font-weight: bold; font-size: 12pt; }
            .company { font-weight: 600; color: #555; }
            .duration-location { text-align: right; font-size: 10pt; color: #666; }
            .description ul { margin-left: 18px; margin-top: 4px; }
            .description li { margin-bottom: 3px; }
            .skills-grid { display: grid; grid-template-columns: 1fr; gap: 4px; }
            .skill-category { margin-bottom: 6px; }
            .skill-label { font-weight: bold; display: inline; margin-right: 8px; }
            .skill-list { display: inline; }
            .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .project-title { font-weight: bold; }
            .project-link { color: #2980b9; text-decoration: none; font-size: 10pt; }
            @media print {
              body { padding: 20px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${originalResumeData.personalInfo.fullName}</div>
            <div class="contact">
              ${originalResumeData.personalInfo.phone ? `${originalResumeData.personalInfo.phone} • ` : ''}
              ${originalResumeData.personalInfo.email || ''}
            </div>
            <div class="contact">
              ${originalResumeData.personalInfo.linkedin ? `<a href="${originalResumeData.personalInfo.linkedin}">LinkedIn</a> • ` : ''}
              ${originalResumeData.personalInfo.github ? `<a href="${originalResumeData.personalInfo.github}">GitHub</a> • ` : ''}
              ${originalResumeData.personalInfo.portfolio ? `<a href="${originalResumeData.personalInfo.portfolio}">Portfolio</a>` : ''}
            </div>
          </div>

          ${originalResumeData.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${originalResumeData.summary}</p>
          </div>
          ` : ''}

          ${originalResumeData.education.degree ? `
          <div class="section">
            <div class="section-title">Education</div>
            <div class="experience-item">
              <div class="job-header">
                <div>
                  <div class="job-title">${originalResumeData.education.degree}</div>
                  <div class="company">${originalResumeData.education.university}</div>
                </div>
                <div class="duration-location">
                  <div>${originalResumeData.education.duration}</div>
                  <div>${originalResumeData.education.location}</div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${originalResumeData.experience.length > 0 && originalResumeData.experience[0].title ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${originalResumeData.experience.map(exp => `
              <div class="experience-item">
                <div class="job-header">
                  <div>
                    <div class="job-title">${exp.title}</div>
                    <div class="company">${exp.company}</div>
                  </div>
                  <div class="duration-location">
                    <div>${exp.duration}</div>
                    <div>${exp.location}</div>
                  </div>
                </div>
                <div class="description">
                  <ul>
                    ${exp.description.map(desc => `<li>${desc.replace(/^•\s*/, '')}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-grid">
              ${Object.entries(originalResumeData.skills).filter(([key, skills]) => skills.length > 0).map(([key, skills]) => `
                <div class="skill-category">
                  <span class="skill-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span class="skill-list">${skills.join(', ')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);

      toast({
        title: "Download Started",
        description: "Original resume is being prepared for download."
      });
    } catch (error) {
      console.error("Original resume download failed:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download original resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
              <p className="text-white">Analyzing your resume against the job requirements...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ADS Score */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              ATS Optimization Score
              {isOptimized && <Badge className="bg-green-600 text-white">Optimized</Badge>}
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
                    className="mt-4 h-3"
                  />
                </div>

                {adsScore.missingKeywords.length > 0 && (
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
                )}

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

                <div className="space-y-3">
                  <Button 
                    onClick={optimizeResume}
                    disabled={optimizing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {optimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        {isOptimized ? "Re-optimize Resume" : "Apply AI Optimizations"}
                      </>
                    )}
                  </Button>

                  {isOptimized && (
                    <Button 
                      onClick={downloadOriginalResume}
                      className="w-full bg-white text-black hover:bg-gray-100 border-none"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Original Version
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Optimization Preview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">AI Optimization Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adsScore?.improvedSections && (
              <>
                {adsScore.improvedSections.summary && (
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Improved Summary</h4>
                    <div className="bg-gray-700 p-3 rounded text-sm text-gray-300">
                      {adsScore.improvedSections.summary}
                    </div>
                  </div>
                )}

                {adsScore.improvedSections.experience && (
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Enhanced Experience Points</h4>
                    <div className="bg-gray-700 p-3 rounded text-sm text-gray-300 space-y-2">
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

            {!jdAnalysis && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Note</h4>
                <p className="text-sm text-gray-300">
                  Without a job description, scoring is based on general resume completeness and quality. 
                  For role-specific optimization, return to step 1 and analyze a job description.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
