import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';
import { AdvancedDorkBuilder } from './advanced-dork-builder';
import { LeadExtractor } from './lead-extractor';

class NewLeadGenerationService {
  private googleApiKey: string;
  private googleCx: string;
  private geminiApiKey: string;
  private leadExtractor: LeadExtractor;

  constructor() {
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.googleCx = import.meta.env.VITE_GOOGLE_CX || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.leadExtractor = new LeadExtractor(this.geminiApiKey);
    
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
      for (let i = 0; i < Math.min(queries.length, 2); i++) {
        const query = queries[i];
        console.log(`🔍 Executing query ${i + 1}:`, query);
        
        try {
          const results = await this.executeGoogleSearch(query);
          console.log(`📊 Query ${i + 1} returned ${results.length} results`);
          allResults.push(...results);
          
          // Rate limiting
          if (i < queries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
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
      
      // Extract leads
      const leads = await this.leadExtractor.extractLeadsFromResults(allResults, criteria);
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
    
    // Base terms
    const industry = criteria.industry[0] || '';
    const location = criteria.location.city || '';
    const role = criteria.jobTitle || '';
    
    // LinkedIn queries
    if (industry && location) {
      queries.push(`site:linkedin.com/in "${industry}" "${location}" (email OR contact)`);
    }
    if (role && location) {
      queries.push(`site:linkedin.com/in "${role}" "${location}" email`);
    }
    
    // Reddit queries
    if (industry) {
      queries.push(`site:reddit.com "${industry}" (hiring OR jobs OR "looking for") ${location ? '"' + location + '"' : ''}`);
    }
    
    // Twitter queries
    if (industry && location) {
      queries.push(`site:twitter.com "${industry}" "${location}" (email OR contact OR hiring)`);
    }
    
    // Fallback general query
    if (queries.length === 0) {
      queries.push(`(site:linkedin.com/in OR site:reddit.com OR site:twitter.com) ${industry} ${location} ${role}`.trim());
    }
    
    return queries;
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

  private async executeGoogleSearch(query: string): Promise<any[]> {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(query)}&num=10`;
    
    console.log('🌐 Making Google Search API request...');
    console.log('🔗 Search URL:', searchUrl.replace(this.googleApiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Search API error:', response.status, errorText);
      throw new Error(`Google Search API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📋 Google Search API response:', {
      totalResults: data.searchInformation?.totalResults,
      itemCount: data.items?.length || 0
    });
    
    return data.items || [];
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
    preview += `🎯 Strategy: Simple, effective Google dorking`;
    
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
