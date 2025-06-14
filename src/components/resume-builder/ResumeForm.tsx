
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { ResumeData, JDAnalysis } from "@/lib/resume-types";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { useToast } from "@/hooks/use-toast";

interface ResumeFormProps {
  jdAnalysis: JDAnalysis;
  onResumeCreated: (data: ResumeData) => void;
}

export function ResumeForm({ jdAnalysis, onResumeCreated }: ResumeFormProps) {
  const [loading, setLoading] = useState(false);
  const [enhancingExperience, setEnhancingExperience] = useState<number | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, getValues } = useForm<ResumeData>({
    defaultValues: {
      personalInfo: {
        fullName: "",
        phone: "",
        email: "",
        linkedin: "",
        github: "",
        portfolio: ""
      },
      summary: jdAnalysis.suggestedSummary || "",
      education: {
        degree: "",
        university: "",
        location: "",
        duration: ""
      },
      experience: [{ title: "", company: "", duration: "", location: "", description: [""] }],
      projects: [{ title: "", description: "", linkLabel: "", url: "" }],
      skills: {
        programmingLanguages: [],
        frameworks: [],
        tools: [],
        softSkills: []
      },
      achievements: [{ title: "", description: "" }],
      positions: [{ role: "", organization: "", description: "" }]
    }
  });

  const watchedExperience = watch("experience");
  const watchedProjects = watch("projects");
  const watchedAchievements = watch("achievements");
  const watchedPositions = watch("positions");

  const addExperience = () => {
    const current = getValues("experience");
    setValue("experience", [...current, { title: "", company: "", duration: "", location: "", description: [""] }]);
  };

  const removeExperience = (index: number) => {
    const current = getValues("experience");
    setValue("experience", current.filter((_, i) => i !== index));
  };

  const addProject = () => {
    const current = getValues("projects");
    setValue("projects", [...current, { title: "", description: "", linkLabel: "", url: "" }]);
  };

  const removeProject = (index: number) => {
    const current = getValues("projects");
    setValue("projects", current.filter((_, i) => i !== index));
  };

  const enhanceExperience = async (index: number) => {
    try {
      setEnhancingExperience(index);
      const experience = getValues(`experience.${index}`);
      const enhanced = await geminiResumeService.enhanceExperience(experience.title, jdAnalysis);
      setValue(`experience.${index}.description`, enhanced);
      toast({
        title: "Experience Enhanced",
        description: "AI has improved your experience descriptions!"
      });
    } catch (error) {
      console.error("Enhancement failed:", error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance experience. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEnhancingExperience(null);
    }
  };

  const onSubmit = async (data: ResumeData) => {
    try {
      setLoading(true);
      // Process skills arrays from comma-separated strings
      const processedData = {
        ...data,
        skills: {
          programmingLanguages: typeof data.skills.programmingLanguages === 'string' 
            ? (data.skills.programmingLanguages as string).split(',').map(s => s.trim()).filter(Boolean)
            : data.skills.programmingLanguages,
          frameworks: typeof data.skills.frameworks === 'string'
            ? (data.skills.frameworks as string).split(',').map(s => s.trim()).filter(Boolean)
            : data.skills.frameworks,
          tools: typeof data.skills.tools === 'string'
            ? (data.skills.tools as string).split(',').map(s => s.trim()).filter(Boolean)
            : data.skills.tools,
          softSkills: typeof data.skills.softSkills === 'string'
            ? (data.skills.softSkills as string).split(',').map(s => s.trim()).filter(Boolean)
            : data.skills.softSkills
        }
      };
      
      onResumeCreated(processedData);
    } catch (error) {
      console.error("Resume creation failed:", error);
      toast({
        title: "Resume Creation Failed",
        description: "Failed to create resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Full Name</Label>
            <Input {...register("personalInfo.fullName")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Phone</Label>
            <Input {...register("personalInfo.phone")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Email</Label>
            <Input {...register("personalInfo.email")} type="email" className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">LinkedIn</Label>
            <Input {...register("personalInfo.linkedin")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">GitHub</Label>
            <Input {...register("personalInfo.github")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Portfolio</Label>
            <Input {...register("personalInfo.portfolio")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            {...register("summary")} 
            placeholder="AI-suggested summary based on job description..."
            rows={4}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Education</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Degree</Label>
            <Input {...register("education.degree")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">University</Label>
            <Input {...register("education.university")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Location</Label>
            <Input {...register("education.location")} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Duration</Label>
            <Input {...register("education.duration")} placeholder="2019-2023" className="bg-gray-800 border-gray-600 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Experience</CardTitle>
          <Button type="button" onClick={addExperience} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {watchedExperience.map((_, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-white">Experience {index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => enhanceExperience(index)}
                    disabled={enhancingExperience === index}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {enhancingExperience === index ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "AI Enhance"
                    )}
                  </Button>
                  {watchedExperience.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeExperience(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Job Title</Label>
                  <Input {...register(`experience.${index}.title`)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Company</Label>
                  <Input {...register(`experience.${index}.company`)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Duration</Label>
                  <Input {...register(`experience.${index}.duration`)} placeholder="Jan 2022 - Present" className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Location</Label>
                  <Input {...register(`experience.${index}.location`)} placeholder="Remote / New York, NY" className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300">Description (one point per line)</Label>
                <Textarea 
                  {...register(`experience.${index}.description.0`)}
                  placeholder="• Led development of responsive web applications using React and TypeScript&#10;• Collaborated with cross-functional teams to deliver high-quality software solutions&#10;• Implemented automated testing reducing bugs by 40%"
                  rows={4}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Projects</CardTitle>
          <Button type="button" onClick={addProject} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {watchedProjects.map((_, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-white">Project {index + 1}</h4>
                {watchedProjects.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeProject(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Project Title</Label>
                  <Input {...register(`projects.${index}.title`)} className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Link Label</Label>
                  <Input {...register(`projects.${index}.linkLabel`)} placeholder="View Project" className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-300">Project URL</Label>
                  <Input {...register(`projects.${index}.url`)} placeholder="https://yourproject.com" className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea 
                  {...register(`projects.${index}.description`)}
                  placeholder="Brief description of the project, technologies used, and key achievements..."
                  rows={3}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Skills</CardTitle>
          <p className="text-gray-400 text-sm">Separate skills with commas</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Programming Languages</Label>
            <Input 
              {...register("skills.programmingLanguages")} 
              placeholder="JavaScript, Python, Java, C++"
              className="bg-gray-800 border-gray-600 text-white" 
            />
          </div>
          <div>
            <Label className="text-gray-300">Frameworks</Label>
            <Input 
              {...register("skills.frameworks")} 
              placeholder="React, Node.js, Express, Django"
              className="bg-gray-800 border-gray-600 text-white" 
            />
          </div>
          <div>
            <Label className="text-gray-300">Tools</Label>
            <Input 
              {...register("skills.tools")} 
              placeholder="Git, Docker, AWS, MongoDB"
              className="bg-gray-800 border-gray-600 text-white" 
            />
          </div>
          <div>
            <Label className="text-gray-300">Soft Skills</Label>
            <Input 
              {...register("skills.softSkills")} 
              placeholder="Leadership, Communication, Problem Solving"
              className="bg-gray-800 border-gray-600 text-white" 
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Resume...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Create Resume
          </>
        )}
      </Button>
    </form>
  );
}
