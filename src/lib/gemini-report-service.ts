
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ReportConfig, GeneratedReport, ReportSection } from './report-types';

export class GeminiReportService {
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

  async generateReport(config: ReportConfig): Promise<GeneratedReport> {
    const prompt = `
      Generate a comprehensive academic report based on the following specifications:

      Report Details:
      - Title: ${config.title}
      - Subject/Topic: ${config.subject}
      - Institution: ${config.institution || 'Not specified'}
      - Author: ${config.authorName}
      - Academic Level: ${config.academicLevel}
      - Report Type: ${config.reportType}
      - Target Word Count: ${config.wordCount} words
      - Target Page Count: ${config.pageCount} pages
      
      ${config.customPrompts ? `Additional Instructions: ${config.customPrompts}` : ''}

      Requirements:
      1. Create a well-structured academic report with proper formatting
      2. Include Abstract, Introduction, Main Body with subheadings, Conclusion, and References
      3. Ensure content is plagiarism-free and academically sound
      4. Use appropriate academic language for ${config.academicLevel} level
      5. Include relevant examples, data, and analysis where appropriate
      6. Maintain logical flow and proper transitions between sections

      Return ONLY valid JSON with this structure:
      {
        "sections": [
          {
            "id": "abstract",
            "title": "Abstract",
            "content": "Abstract content here...",
            "editable": true
          },
          {
            "id": "introduction", 
            "title": "Introduction",
            "content": "Introduction content here...",
            "editable": true
          },
          {
            "id": "main-body",
            "title": "Main Body",
            "content": "Main body content with proper headings and subheadings...",
            "editable": true
          },
          {
            "id": "conclusion",
            "title": "Conclusion", 
            "content": "Conclusion content here...",
            "editable": true
          },
          {
            "id": "references",
            "title": "References",
            "content": "References/Citations in proper academic format...",
            "editable": true
          }
        ]
      }

      Ensure each section is substantial and meets academic standards for ${config.reportType}.
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      const parsed = JSON.parse(cleanedText);
      
      return {
        config,
        sections: parsed.sections,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Report generation failed:', error);
      throw new Error('Failed to generate report');
    }
  }

  async regenerateSection(sectionId: string, sectionTitle: string, config: ReportConfig, currentContent: string): Promise<string> {
    const prompt = `
      Regenerate the "${sectionTitle}" section for an academic report with these specifications:
      
      Report Details:
      - Title: ${config.title}
      - Subject: ${config.subject}
      - Academic Level: ${config.academicLevel}
      - Report Type: ${config.reportType}
      
      Current Content: ${currentContent}
      
      Generate an improved version of this section that:
      1. Maintains academic standards and proper formatting
      2. Is appropriate for ${config.academicLevel} level
      3. Fits well with the overall report structure
      4. Uses clear, professional language
      
      Return only the section content without any additional formatting or explanations.
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      return await result.response.text();
    } catch (error) {
      console.error('Section regeneration failed:', error);
      throw new Error('Failed to regenerate section');
    }
  }
}

export const geminiReportService = new GeminiReportService();
