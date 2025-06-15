
import { Lead } from './lead-types';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export class LeadExtractor {
  private geminiApiKey: string;

  constructor(geminiApiKey: string) {
    this.geminiApiKey = geminiApiKey;
  }

  async extractLeadsFromResults(results: SearchResult[], criteria: any): Promise<Lead[]> {
    console.log(`Processing ${results.length} search results for lead extraction...`);
    
    const leads: Lead[] = [];
    
    for (let i = 0; i < Math.min(results.length, 20); i++) {
      const result = results[i];
      
      try {
        const extractedLead = await this.extractSingleLead(result, criteria);
        if (extractedLead) {
          leads.push(extractedLead);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error extracting lead from result ${i + 1}:`, error);
      }
    }
    
    return leads;
  }

  private async extractSingleLead(result: SearchResult, criteria: any): Promise<Lead | null> {
    const prompt = this.buildExtractionPrompt(result, criteria);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        return this.parseLeadFromResponse(generatedText, result);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
    }
    
    return null;
  }

  private buildExtractionPrompt(result: SearchResult, criteria: any): string {
    return `
Extract professional lead information from this Google search result:

SEARCH RESULT:
Title: ${result.title}
URL: ${result.link}
Description: ${result.snippet}

TARGET CRITERIA:
- Industry: ${criteria.industry?.join(', ') || 'Any'}
- Role: ${criteria.jobTitle || 'Any'}
- Location: ${criteria.location?.city || ''} ${criteria.location?.state || ''} ${criteria.location?.country || ''}

EXTRACTION RULES:
1. Extract ONLY real contact information visible in the snippet
2. Generate professional email if pattern is clear (firstname.lastname@company.com)
3. Extract phone numbers in any format
4. Determine company name from context
5. Assign relevance score (60-100) based on criteria match

Return ONLY valid JSON:
{
  "name": "Full Name",
  "company": "Company Name", 
  "jobTitle": "Professional Role",
  "email": "email@company.com",
  "phone": "+1-XXX-XXX-XXXX",
  "location": "City, State",
  "industry": "Industry Category",
  "score": 85
}

If no valid lead can be extracted, return: {}
`;
  }

  private parseLeadFromResponse(response: string, result: SearchResult): Lead | null {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      
      const leadData = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!leadData.name || Object.keys(leadData).length < 4) {
        return null;
      }
      
      return {
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: leadData.name,
        company: leadData.company || 'Unknown Company',
        jobTitle: leadData.jobTitle || 'Professional',
        email: leadData.email,
        phone: leadData.phone,
        location: leadData.location || 'Unknown Location',
        industry: leadData.industry || 'Professional Services',
        linkedinUrl: result.link.includes('linkedin') ? result.link : undefined,
        companySize: '10-50',
        score: Math.min(100, Math.max(60, parseInt(leadData.score) || 75)),
        sourceUrl: result.link
      };
    } catch (error) {
      console.error('Error parsing lead response:', error);
      return null;
    }
  }
}
