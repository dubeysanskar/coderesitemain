
import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';
import { googleDorkingService } from './google-dorking-service';

class LeadGenerationService {
  private googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.GOOGLE_API_KEY;
  private googleCx = import.meta.env.VITE_GOOGLE_CX || import.meta.env.GOOGLE_CX;
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('Starting advanced lead generation with criteria:', criteria);
    
    try {
      // Generate Google Dork query
      const dorkQuery = googleDorkingService.generateGoogleDork(criteria);
      console.log('Generated Google Dork:', dorkQuery);
      
      // Search multiple pages (1-5) for comprehensive results
      const allSearchResults = [];
      const maxPages = Math.min(criteria.searchDepth || 5, 5);
      
      for (let page = 0; page < maxPages; page++) {
        const startIndex = page * 10 + 1;
        const pageResults = await this.searchGoogleWithDork(dorkQuery.query, startIndex);
        allSearchResults.push(...pageResults);
        
        // Add delay between requests to avoid rate limiting
        if (page < maxPages - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log(`Found ${allSearchResults.length} search results across ${maxPages} pages`);
      
      // Process results with enhanced AI
      const processedLeads = await this.processWithAdvancedAI(allSearchResults, criteria);
      console.log('Processed leads:', processedLeads);
      
      return {
        leads: processedLeads,
        totalCount: processedLeads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString(),
        googleDorkQuery: dorkQuery.query
      };
    } catch (error) {
      console.error('Error in advanced lead generation:', error);
      throw error;
    }
  }

  private async searchGoogleWithDork(dorkQuery: string, startIndex: number = 1): Promise<any[]> {
    if (!this.googleApiKey || !this.googleCx) {
      throw new Error('Google API credentials are missing');
    }

    console.log(`Searching with dork query (page ${Math.ceil(startIndex/10)}):`, dorkQuery);

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(dorkQuery)}&num=10&start=${startIndex}`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  private async processWithAdvancedAI(searchResults: any[], criteria: LeadSearchCriteria): Promise<Lead[]> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is missing');
    }

    const leads: Lead[] = [];
    const maxResults = Math.min(searchResults.length, 50); // Process up to 50 results

    for (let i = 0; i < maxResults; i++) {
      const result = searchResults[i];
      
      try {
        const prompt = `
        Extract professional lead information from this search result that matches the specific criteria:
        
        SEARCH RESULT:
        Title: ${result.title}
        Snippet: ${result.snippet}
        URL: ${result.link}
        
        TARGET CRITERIA:
        - Industries: ${criteria.industry.join(', ')}
        - Location: ${criteria.location.city || ''} ${criteria.location.state || ''} ${criteria.location.country || ''}
        - Role: ${criteria.jobTitle}
        - Field/Domain: ${criteria.field}
        - Keywords: ${criteria.keywords.join(', ')}
        - Custom Tags: ${criteria.customTags.join(', ')}
        - Company Size: ${criteria.companySize}
        
        REQUIREMENTS:
        - MUST have both email AND phone (mandatory)
        - Extract only real, verified contact information
        - Assign relevance score based on criteria match
        
        Extract and format as JSON:
        {
          "name": "Full name of the professional",
          "company": "Company/Organization name",
          "jobTitle": "Exact job title or role",
          "email": "Valid email address (REQUIRED)",
          "phone": "Phone number with country code (REQUIRED)",
          "location": "City, State, Country format",
          "industry": "Primary industry category",
          "field": "Specific domain/field expertise",
          "companySize": "Estimated company size range",
          "score": "Relevance score 1-100 based on criteria match",
          "linkedinUrl": "LinkedIn profile URL if available",
          "sourceUrl": "${result.link}",
          "matchingKeywords": ["list", "of", "matching", "keywords"],
          "verified": "true/false based on information reliability"
        }
        
        VALIDATION RULES:
        - Only return results with BOTH email AND phone
        - Email must follow valid format
        - Phone must include country code
        - Score based on exact criteria matching
        - Mark as verified only if information appears authentic
        
        If contact information is missing or criteria don't match well, return empty object {}.
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
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const leadData = JSON.parse(jsonMatch[0]);
              
              // Validate required fields
              if (!leadData.email || !leadData.phone || Object.keys(leadData).length < 5) {
                continue;
              }
              
              const lead: Lead = {
                id: `lead-${Date.now()}-${i}`,
                name: leadData.name || `Professional ${i + 1}`,
                company: leadData.company || 'Unknown Company',
                jobTitle: leadData.jobTitle || criteria.jobTitle || 'Professional',
                email: leadData.email,
                phone: leadData.phone,
                location: leadData.location || `${criteria.location.city || ''} ${criteria.location.state || ''}`.trim(),
                industry: leadData.industry || criteria.industry[0] || 'Professional Services',
                linkedinUrl: leadData.linkedinUrl || undefined,
                companySize: leadData.companySize || criteria.companySize || '10-50',
                score: Math.min(100, Math.max(60, parseInt(leadData.score) || 75)),
                sourceUrl: leadData.sourceUrl || result.link
              };

              // Apply strict filtering
              if (criteria.emailRequired && !lead.email) continue;
              if (criteria.phoneRequired && !lead.phone) continue;

              leads.push(lead);
            }
          } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
          }
        }
        
        // Add delay between AI requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error processing result with AI:', error);
      }
    }

    return leads;
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Role', 'Industry', 'Location', 'Email', 'Phone', 'Source URL'];
      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          lead.name,
          lead.jobTitle,
          lead.industry,
          lead.location,
          lead.email || '',
          lead.phone || '',
          lead.sourceUrl || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    return 'XLSX export would be implemented with a proper library';
  }

  generateGoogleDorkPreview(criteria: LeadSearchCriteria): string {
    const dorkQuery = googleDorkingService.generateGoogleDork(criteria);
    return googleDorkingService.formatQueryForDisplay(dorkQuery);
  }
}

export const leadGenerationService = new LeadGenerationService();
