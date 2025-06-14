
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Zap, ExternalLink } from "lucide-react";
import { ResumeData } from "@/lib/resume-types";

interface ResumePreviewProps {
  resumeData: ResumeData;
  onOptimize: () => void;
}

export function ResumePreview({ resumeData, onOptimize }: ResumePreviewProps) {
  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    console.log("Downloading PDF...");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Resume Preview */}
      <div className="lg:col-span-2">
        <Card className="bg-white border-gray-300 text-black">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.fullName}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline">
                    LinkedIn
                  </a>
                )}
                {resumeData.personalInfo.github && (
                  <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                )}
                {resumeData.personalInfo.portfolio && (
                  <a href={resumeData.personalInfo.portfolio} className="text-blue-600 hover:underline">
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {resumeData.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-sm leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Education */}
            {resumeData.education.degree && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                  EDUCATION
                </h2>
                <div className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{resumeData.education.degree}</p>
                      <p>{resumeData.education.university}</p>
                    </div>
                    <div className="text-right">
                      <p>{resumeData.education.duration}</p>
                      <p>{resumeData.education.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && resumeData.experience[0].title && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                  EXPERIENCE
                </h2>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-semibold">{exp.title}</p>
                          <p className="font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p>{exp.duration}</p>
                          <p>{exp.location}</p>
                        </div>
                      </div>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {exp.description.map((desc, descIndex) => (
                          <li key={descIndex} className="leading-relaxed">
                            {desc.replace(/^•\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && resumeData.projects[0].title && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                  PROJECTS
                </h2>
                <div className="space-y-3">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold">{project.title}</p>
                        {project.url && project.linkLabel && (
                          <a 
                            href={project.url} 
                            className="text-blue-600 hover:underline flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.linkLabel}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="leading-relaxed mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                TECHNICAL SKILLS
              </h2>
              <div className="text-sm space-y-1">
                {resumeData.skills.programmingLanguages.length > 0 && (
                  <p>
                    <span className="font-semibold">Programming Languages:</span>{" "}
                    {resumeData.skills.programmingLanguages.join(", ")}
                  </p>
                )}
                {resumeData.skills.frameworks.length > 0 && (
                  <p>
                    <span className="font-semibold">Frameworks:</span>{" "}
                    {resumeData.skills.frameworks.join(", ")}
                  </p>
                )}
                {resumeData.skills.tools.length > 0 && (
                  <p>
                    <span className="font-semibold">Tools:</span>{" "}
                    {resumeData.skills.tools.join(", ")}
                  </p>
                )}
                {resumeData.skills.softSkills.length > 0 && (
                  <p>
                    <span className="font-semibold">Soft Skills:</span>{" "}
                    {resumeData.skills.softSkills.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Achievements */}
            {resumeData.achievements.length > 0 && resumeData.achievements[0].title && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                  ACHIEVEMENTS
                </h2>
                <div className="space-y-2">
                  {resumeData.achievements.map((achievement, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="leading-relaxed">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positions of Responsibility */}
            {resumeData.positions.length > 0 && resumeData.positions[0].role && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">
                  POSITIONS OF RESPONSIBILITY
                </h2>
                <div className="space-y-2">
                  {resumeData.positions.map((position, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-semibold">{position.role} - {position.organization}</p>
                      <p className="leading-relaxed">{position.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions Panel */}
      <div className="space-y-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Resume Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            <Button 
              onClick={onOptimize}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize with AI
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Resume Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Keep your resume to one page</li>
              <li>• Use action verbs to describe your experience</li>
              <li>• Quantify your achievements with numbers</li>
              <li>• Tailor your skills to match the job description</li>
              <li>• Use consistent formatting throughout</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
