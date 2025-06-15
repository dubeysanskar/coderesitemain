
import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';

class LeadGenerationService {
  private googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.GOOGLE_API_KEY;
  private googleCx = import.meta.env.VITE_GOOGLE_CX || import.meta.env.GOOGLE_CX;
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('Starting lead generation with criteria:', criteria);
    
    try {
      // Step 1: Search Google for relevant businesses/contacts
      const searchResults = await this.searchGoogle(criteria);
      console.log('Google search results:', searchResults);
      
      // Step 2: Process and enhance results with Gemini AI
      const processedLeads = await this.processWithGemini(searchResults, criteria);
      console.log('Processed leads:', processedLeads);
      
      return {
        leads: processedLeads,
        totalCount: processedLeads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in lead generation:', error);
      throw error;
    }
  }

  private async searchGoogle(criteria: LeadSearchCriteria): Promise<any[]> {
    if (!this.googleApiKey || !this.googleCx) {
      throw new Error('Google API credentials are missing');
    }

    // Build search query based on criteria
    let searchQuery = '';
    
    if (criteria.industry) {
      searchQuery += `${criteria.industry} business `;
    }
    
    if (criteria.location) {
      searchQuery += `in ${criteria.location} `;
    }
    
    if (criteria.jobTitle) {
      searchQuery += `${criteria.jobTitle} `;
    }
    
    if (criteria.keywords) {
      searchQuery += `${criteria.keywords} `;
    }
    
    // Add contact information keywords
    searchQuery += 'contact email phone address';
    
    console.log('Search query:', searchQuery);

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(searchQuery)}&num=10`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  private async processWithGemini(searchResults: any[], criteria: LeadSearchCriteria): Promise<Lead[]> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is missing');
    }

    const leads: Lead[] = [];

    for (let i = 0; i < Math.min(searchResults.length, 10); i++) {
      const result = searchResults[i];
      
      try {
        const prompt = `
        Extract business lead information from this search result:
        Title: ${result.title}
        Snippet: ${result.snippet}
        URL: ${result.link}
        
        Search criteria:
        - Industry: ${criteria.industry}
        - Location: ${criteria.location}
        - Job Title: ${criteria.jobTitle}
        - Company Size: ${criteria.companySize}
        
        Please extract and format as JSON:
        {
          "name": "Contact person name (if available, otherwise use company name)",
          "company": "Company name",
          "jobTitle": "Job title or role",
          "email": "Email if found",
          "phone": "Phone if found",
          "location": "Location/address",
          "industry": "Industry category",
          "companySize": "Estimated company size",
          "score": "Match score 1-100 based on criteria",
          "linkedinUrl": "LinkedIn URL if found"
        }
        
        If information is not available, use reasonable estimates or leave empty strings.
        `;

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
          console.error('Gemini API error:', response.status);
          continue;
        }

        const geminiData = await response.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText) {
          try {
            // Extract JSON from the response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const leadData = JSON.parse(jsonMatch[0]);
              
              const lead: Lead = {
                id: `lead-${Date.now()}-${i}`,
                name: leadData.name || `Contact ${i + 1}`,
                company: leadData.company || result.title.split(' - ')[0],
                jobTitle: leadData.jobTitle || criteria.jobTitle || 'Business Owner',
                email: leadData.email || undefined,
                phone: leadData.phone || undefined,
                location: leadData.location || criteria.location || 'India',
                industry: leadData.industry || criteria.industry || 'Business',
                linkedinUrl: leadData.linkedinUrl || undefined,
                companySize: leadData.companySize || criteria.companySize || '10-50',
                score: Math.min(100, Math.max(60, parseInt(leadData.score) || 75))
              };

              // Filter based on requirements
              if (criteria.emailRequired && !lead.email) continue;
              if (criteria.phoneRequired && !lead.phone) continue;

              leads.push(lead);
            }
          } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
          }
        }
      } catch (error) {
        console.error('Error processing result with Gemini:', error);
      }
    }

    return leads;
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Company', 'Job Title', 'Email', 'Phone', 'Location', 'Industry', 'Score'];
      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          lead.name,
          lead.company,
          lead.jobTitle,
          lead.email || '',
          lead.phone || '',
          lead.location,
          lead.industry,
          lead.score
        ].join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    return 'XLSX export would be implemented with a proper library';
  }
}

export const leadGenerationService = new LeadGenerationService();
