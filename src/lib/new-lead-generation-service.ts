
import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';

class NewLeadGenerationService {
  private googleApiKey: string;
  private googleCx: string;
  private geminiApiKey: string;

  constructor() {
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.googleCx = import.meta.env.VITE_GOOGLE_CX || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    console.log('🔑 API Keys Check:', {
      hasGoogleKey: !!this.googleApiKey,
      hasGoogleCx: !!this.googleCx,
      hasGeminiKey: !!this.geminiApiKey
    });
  }

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('🚀 Starting lead generation with criteria:', criteria);
    
    this.validateApiKeys();
    
    try {
      // Create simple, effective dork queries
      const queries = this.buildSimpleQueries(criteria);
      console.log('📋 Generated queries:', queries);
      
      // Execute searches
      const allResults = [];
      for (let i = 0; i < Math.min(queries.length, 3); i++) {
        const query = queries[i];
        console.log(`🔍 Executing query ${i + 1}:`, query);
        
        try {
          const results = await this.executeGoogleSearch(query);
          console.log(`📊 Query ${i + 1} returned ${results.length} results`);
          allResults.push(...results);
          
          // Rate limiting
          if (i < queries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        } catch (error) {
          console.error(`❌ Query ${i + 1} failed:`, error);
        }
      }
      
      console.log(`📈 Total search results: ${allResults.length}`);
      
      if (allResults.length === 0) {
        console.log('❌ No search results found');
        return this.createEmptyResult(criteria, queries[0] || '');
      }
      
      // Extract leads with simpler logic
      const leads = await this.extractLeadsFromResults(allResults, criteria);
      console.log(`✅ Extracted ${leads.length} leads`);
      
      return {
        leads,
        totalCount: leads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString(),
        googleDorkQuery: queries.join(' | ')
      };
      
    } catch (error) {
      console.error('❌ Lead generation failed:', error);
      throw new Error(`Lead generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSimpleQueries(criteria: LeadSearchCriteria): string[] {
    const queries = [];
    
    // Get the basic info
    const industry = criteria.industry[0] || '';
    const location = criteria.location.city || '';
    const role = criteria.jobTitle || '';
    
    console.log('🏗️ Building queries with:', { industry, location, role });
    
    // LinkedIn professional profiles
    if (industry && location) {
      queries.push(`site:linkedin.com/in "${industry}" "${location}"`);
    }
    if (role && location) {
      queries.push(`site:linkedin.com/in "${role}" "${location}"`);
    }
    
    // Reddit job posts and discussions
    if (industry) {
      queries.push(`site:reddit.com "${industry}" "${location || 'hiring'}" (job OR work OR opportunity)`);
    }
    
    // Twitter professional posts
    if (industry && location) {
      queries.push(`site:twitter.com "${industry}" "${location}" (hiring OR jobs OR work)`);
    }
    
    // General fallback query
    if (queries.length === 0) {
      const searchTerms = [industry, location, role].filter(Boolean);
      if (searchTerms.length > 0) {
        queries.push(`(site:linkedin.com/in OR site:reddit.com OR site:twitter.com) ${searchTerms.join(' ')}`);
      }
    }
    
    console.log('✅ Built queries:', queries);
    return queries;
  }

  private async executeGoogleSearch(query: string): Promise<any[]> {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(query)}&num=10`;
    
    console.log('🌐 Making Google Search API request...');
    console.log('🔗 Search query:', query);
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Search API error:', response.status, errorText);
      throw new Error(`Google Search API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📋 Google Search API response:', {
      totalResults: data.searchInformation?.totalResults,
      itemCount: data.items?.length || 0,
      items: data.items?.slice(0, 3).map(item => ({ title: item.title, link: item.link }))
    });
    
    return data.items || [];
  }

  private async extractLeadsFromResults(results: any[], criteria: LeadSearchCriteria): Promise<Lead[]> {
    console.log(`🔍 Processing ${results.length} search results for lead extraction...`);
    
    const leads: Lead[] = [];
    
    // Process first 5 results to avoid hitting limits
    for (let i = 0; i < Math.min(results.length, 5); i++) {
      const result = results[i];
      console.log(`📋 Processing result ${i + 1}: ${result.title}`);
      
      try {
        const lead = await this.extractSingleLead(result, criteria);
        if (lead) {
          console.log(`✅ Extracted lead: ${lead.name} at ${lead.company}`);
          leads.push(lead);
        } else {
          console.log(`❌ No valid lead extracted from result ${i + 1}`);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`❌ Error extracting lead from result ${i + 1}:`, error);
      }
    }
    
    console.log(`📊 Final lead extraction count: ${leads.length}`);
    return leads;
  }

  private async extractSingleLead(result: any, criteria: LeadSearchCriteria): Promise<Lead | null> {
    const prompt = `
Extract professional lead information from this search result:

Title: ${result.title}
URL: ${result.link}
Description: ${result.snippet}

Target Industry: ${criteria.industry?.join(', ') || 'Any'}
Target Location: ${criteria.location?.city || 'Any'}

Extract ONLY if you can find a real person's professional information. Return JSON:
{
  "name": "First Last",
  "company": "Company Name", 
  "jobTitle": "Job Title",
  "location": "City, State/Country",
  "industry": "Industry"
}

If no clear person/professional info found, return: {"error": "no_lead_found"}
`;

    try {
      console.log('🤖 Calling Gemini API for lead extraction...');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        console.error('❌ Gemini API error:', response.status);
        return null;
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        console.log('📝 Gemini response:', generatedText.substring(0, 200) + '...');
        return this.parseLeadFromResponse(generatedText, result, criteria);
      }
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
    }
    
    return null;
  }

  private parseLeadFromResponse(response: string, result: any, criteria: LeadSearchCriteria): Lead | null {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log('❌ No JSON found in Gemini response');
        return null;
      }
      
      const leadData = JSON.parse(jsonMatch[0]);
      
      if (leadData.error || !leadData.name) {
        console.log('❌ No valid lead data found in response');
        return null;
      }
      
      // Fix location issue - use the extracted location or user's input
      const finalLocation = leadData.location || criteria.location.city || 'Unknown Location';
      
      const lead: Lead = {
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: leadData.name,
        company: leadData.company || 'Unknown Company',
        jobTitle: leadData.jobTitle || 'Professional',
        email: leadData.email,
        phone: leadData.phone,
        location: finalLocation, // Fixed location logic
        industry: leadData.industry || criteria.industry?.[0] || 'Professional Services',
        linkedinUrl: result.link.includes('linkedin') ? result.link : undefined,
        companySize: '10-50',
        score: 75,
        sourceUrl: result.link
      };
      
      console.log('✅ Successfully parsed lead:', { name: lead.name, location: lead.location });
      return lead;
    } catch (error) {
      console.error('❌ Error parsing lead response:', error);
      return null;
    }
  }

  private validateApiKeys(): void {
    if (!this.googleApiKey) {
      throw new Error('Google API key is missing. Set VITE_GOOGLE_API_KEY environment variable.');
    }
    if (!this.googleCx) {
      throw new Error('Google CX is missing. Set VITE_GOOGLE_CX environment variable.');
    }
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is missing. Set VITE_GEMINI_API_KEY environment variable.');
    }
  }

  private createEmptyResult(criteria: LeadSearchCriteria, query: string): LeadGenerationResult {
    return {
      leads: [],
      totalCount: 0,
      searchCriteria: criteria,
      generatedAt: new Date().toISOString(),
      googleDorkQuery: query
    };
  }

  generateDorkPreview(criteria: LeadSearchCriteria): string {
    const queries = this.buildSimpleQueries(criteria);
    
    let preview = '🔍 Google Dork Queries Generated:\n\n';
    
    queries.forEach((query, index) => {
      preview += `${index + 1}. ${query}\n\n`;
    });
    
    preview += `📊 Total Queries: ${queries.length}\n`;
    preview += `🎯 Platforms: LinkedIn, Reddit, Twitter`;
    
    return preview;
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Company', 'Job Title', 'Email', 'Phone', 'Location', 'Industry', 'Score', 'Source'];
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
          lead.score,
          lead.sourceUrl || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    return 'XLSX export requires additional library implementation';
  }
}

export const newLeadGenerationService = new NewLeadGenerationService();
