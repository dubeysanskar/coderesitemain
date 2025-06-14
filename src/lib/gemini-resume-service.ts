
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { JDAnalysis, ResumeData, ADSOptimization } from './resume-types';

export class GeminiResumeService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  private extractJsonFromResponse(text: string): string {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1].trim();
    }
    return text;
  }

  async analyzeJobDescription(jobDescription: string): Promise<JDAnalysis> {
    const prompt = `
      Extract the most relevant hard skills, soft skills, tools, technologies, and role responsibilities from the following Job Description. These will be used to guide resume creation and optimization.

      Job Description:
      ${jobDescription}

      Return ONLY valid JSON with this structure:
      {
        "keySkills": ["skill1", "skill2", "skill3"],
        "tools": ["tool1", "tool2", "tool3"],
        "responsibilities": ["responsibility1", "responsibility2"],
        "industryKeywords": ["keyword1", "keyword2"],
        "suggestedSummary": "A 3-4 line professional summary based on this JD",
        "missingSkills": ["additional skills that might be valuable"]
      }
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('JD Analysis failed:', error);
      throw new Error('Failed to analyze job description');
    }
  }

  async enhanceExperience(jobTitle: string, jdAnalysis: JDAnalysis): Promise<string[]> {
    const prompt = `
      Given this job title "${jobTitle}" and the following job requirements, suggest 4-5 impactful experience descriptions with metrics that would align well with this role.

      Key Skills Required: ${jdAnalysis.keySkills.join(', ')}
      Tools: ${jdAnalysis.tools.join(', ')}
      Responsibilities: ${jdAnalysis.responsibilities.join(', ')}

      Return ONLY valid JSON array:
      ["Enhanced experience point 1", "Enhanced experience point 2", "Enhanced experience point 3", "Enhanced experience point 4"]
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Experience enhancement failed:', error);
      return ["Enhanced job responsibilities with focus on results", "Collaborated with cross-functional teams", "Implemented solutions that improved efficiency"];
    }
  }

  async calculateADSScore(resumeData: ResumeData, jdAnalysis: JDAnalysis | null): Promise<ADSOptimization> {
    // If no JD analysis, provide general scoring
    if (!jdAnalysis) {
      return this.calculateGeneralScore(resumeData);
    }

    const prompt = `
      Evaluate how well this resume matches the Job Description requirements. Be STRICT in scoring - only give high scores for truly excellent matches.

      SCORING CRITERIA (Be harsh and realistic):
      - Empty or minimal content should score 10-30
      - Basic content with some matches should score 30-50  
      - Good content with decent matches should score 50-70
      - Strong content with good matches should score 70-85
      - Exceptional content with excellent matches should score 85-95

      Resume Content:
      Summary: "${resumeData.summary || 'No summary provided'}"
      Skills: ${[...resumeData.skills.programmingLanguages, ...resumeData.skills.frameworks, ...resumeData.skills.tools, ...resumeData.skills.softSkills].join(', ') || 'No skills listed'}
      Experience: ${resumeData.experience.map(exp => `${exp.title} at ${exp.company}: ${exp.description.join(' ')}`).join(' | ') || 'No experience listed'}
      Education: ${resumeData.education.degree || 'No education listed'}

      Job Requirements:
      Key Skills: ${jdAnalysis.keySkills.join(', ')}
      Tools: ${jdAnalysis.tools.join(', ')}
      Keywords: ${jdAnalysis.industryKeywords.join(', ')}

      Analyze keyword matching, skills alignment, and content quality. Be realistic - don't inflate scores.

      Return ONLY valid JSON:
      {
        "score": 45,
        "missingKeywords": ["specific missing keywords from JD"],
        "recommendations": ["Specific actionable improvements"],
        "improvedSections": {
          "summary": "Enhanced summary with better keyword alignment",
          "experience": ["Improved experience point 1", "Improved experience point 2"],
          "skills": ["Additional relevant skill 1", "Additional relevant skill 2"]
        }
      }
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('ADS calculation failed:', error);
      throw new Error('Failed to calculate ADS score');
    }
  }

  private async calculateGeneralScore(resumeData: ResumeData): Promise<ADSOptimization> {
    // Calculate basic completeness score without JD
    let score = 0;
    const recommendations: string[] = [];
    const missingKeywords: string[] = [];

    // Basic scoring based on completeness
    if (resumeData.summary && resumeData.summary.length > 50) score += 20;
    else recommendations.push("Add a comprehensive professional summary");

    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) score += 10;
    else recommendations.push("Complete all contact information");

    if (resumeData.experience.length > 0 && resumeData.experience[0].title) score += 25;
    else recommendations.push("Add relevant work experience");

    if (resumeData.education.degree) score += 15;
    else recommendations.push("Include education details");

    const allSkills = [...resumeData.skills.programmingLanguages, ...resumeData.skills.frameworks, ...resumeData.skills.tools, ...resumeData.skills.softSkills];
    if (allSkills.length > 3) score += 20;
    else recommendations.push("Add more relevant skills");

    if (resumeData.projects.length > 0 && resumeData.projects[0].title) score += 10;
    else recommendations.push("Include relevant projects");

    return {
      score: Math.min(score, 85), // Cap at 85 without JD analysis
      missingKeywords,
      recommendations,
      improvedSections: {
        summary: resumeData.summary ? `Enhanced: ${resumeData.summary.substring(0, 100)}...` : "Add a compelling professional summary highlighting your key strengths and career objectives.",
        experience: ["Add quantifiable achievements with metrics", "Include action verbs and specific technologies used"],
        skills: ["Add industry-relevant technical skills", "Include soft skills relevant to your target role"]
      }
    };
  }

  async optimizeResume(resumeData: ResumeData, jdAnalysis: JDAnalysis | null): Promise<ResumeData> {
    const jdContext = jdAnalysis ? 
      `Job Requirements: ${JSON.stringify(jdAnalysis)}` : 
      "No specific job requirements - optimize for general improvement";

    const prompt = `
      Enhance this resume content by improving weak sections and adding relevant phrases. Keep the same structure but improve the content quality.

      Current Resume:
      ${JSON.stringify(resumeData)}

      ${jdContext}

      Return the complete optimized resume data in the exact same JSON structure, but with improved content that is more professional and impactful.
      Focus on:
      - Stronger action verbs
      - Quantifiable achievements  
      - Better keyword integration
      - More compelling descriptions
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Resume optimization failed:', error);
      throw new Error('Failed to optimize resume');
    }
  }
}

export const geminiResumeService = new GeminiResumeService();
