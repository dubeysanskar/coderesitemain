
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

  async calculateADSScore(resumeData: ResumeData, jdAnalysis: JDAnalysis): Promise<ADSOptimization> {
    const prompt = `
      Evaluate how well this resume matches the following Job Description requirements. Assign an ATS (ADS) score out of 100 and list the missing keywords or suggestions to improve alignment.

      Resume Summary: ${resumeData.summary}
      Skills: ${[...resumeData.skills.programmingLanguages, ...resumeData.skills.frameworks, ...resumeData.skills.tools].join(', ')}
      Experience: ${resumeData.experience.map(exp => exp.description.join(' ')).join(' ')}

      Job Requirements:
      Key Skills: ${jdAnalysis.keySkills.join(', ')}
      Tools: ${jdAnalysis.tools.join(', ')}
      Keywords: ${jdAnalysis.industryKeywords.join(', ')}

      Return ONLY valid JSON:
      {
        "score": 85,
        "missingKeywords": ["keyword1", "keyword2"],
        "recommendations": ["Add more specific metrics", "Include missing technology X"],
        "improvedSections": {
          "summary": "Improved summary text",
          "experience": ["Improved experience point 1", "Improved experience point 2"],
          "skills": ["Additional skill 1", "Additional skill 2"]
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

  async optimizeResume(resumeData: ResumeData, jdAnalysis: JDAnalysis): Promise<ResumeData> {
    const prompt = `
      Based on the current resume and this Job Description, improve the content by rewriting weak sections and adding relevant phrases to maximize alignment with recruiter expectations.

      Current Resume:
      Summary: ${resumeData.summary}
      Experience: ${JSON.stringify(resumeData.experience)}
      Skills: ${JSON.stringify(resumeData.skills)}

      Job Requirements:
      ${JSON.stringify(jdAnalysis)}

      Return the complete optimized resume data in the exact same JSON structure, but with improved content that better matches the job requirements.
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
