
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
  }

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('🚀 Starting advanced Google dorking lead generation...');
    
    this.validateApiKeys();
    
    try {
      // Build advanced Google dork queries
      const dorkBuilder = new AdvancedDorkBuilder(criteria);
      const dorkQueries = dorkBuilder.generateDorkQueries();
      
      console.log(`📋 Generated ${dorkQueries.length} specialized dork queries`);
      
      // Execute multiple dork queries
      const allResults = [];
      for (const dorkQuery of dorkQueries.slice(0, 3)) { // Limit to top 3 queries
        console.log(`🔍 Executing: ${dorkQuery.description}`);
        
        try {
          const results = await this.executeGoogleSearch(dorkQuery.query);
          allResults.push(...results);
          
          // Rate limiting between queries
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ Query failed: ${dorkQuery.description}`, error);
        }
      }
      
      // Remove duplicates
      const uniqueResults = this.removeDuplicateResults(allResults);
      console.log(`📊 Found ${uniqueResults.length} unique search results`);
      
      if (uniqueResults.length === 0) {
        return this.createEmptyResult(criteria, dorkQueries[0]?.query || '');
      }
      
      // Extract leads using AI
      const leads = await this.leadExtractor.extractLeadsFromResults(uniqueResults, criteria);
      
      // Apply additional filtering
      const filteredLeads = this.applyLeadFilters(leads, criteria);
      
      console.log(`✅ Successfully generated ${filteredLeads.length} qualified leads`);
      
      return {
        leads: filteredLeads,
        totalCount: filteredLeads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString(),
        googleDorkQuery: dorkQueries.map(q => q.query).join(' | ')
      };
      
    } catch (error) {
      console.error('❌ Lead generation failed:', error);
      throw new Error(`Lead generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  private async executeGoogleSearch(query: string): Promise<any[]> {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(query)}&num=10`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Search API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.items || [];
  }

  private removeDuplicateResults(results: any[]): any[] {
    const seen = new Set();
    return results.filter(result => {
      const key = result.link;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private applyLeadFilters(leads: Lead[], criteria: LeadSearchCriteria): Lead[] {
    return leads.filter(lead => {
      // Email requirement
      if (criteria.emailRequired && !lead.email) return false;
      
      // Phone requirement  
      if (criteria.phoneRequired && !lead.phone) return false;
      
      // Minimum score requirement
      if (lead.score < 65) return false;
      
      return true;
    });
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
    const dorkBuilder = new AdvancedDorkBuilder(criteria);
    const queries = dorkBuilder.generateDorkQueries();
    
    let preview = '🔍 Advanced Google Dork Queries Generated:\n\n';
    
    queries.slice(0, 5).forEach((query, index) => {
      preview += `${index + 1}. ${query.category}: ${query.description}\n`;
      preview += `   Query: ${query.query}\n\n`;
    });
    
    preview += `📊 Total Queries: ${queries.length}\n`;
    preview += `🎯 Strategy: Multi-pattern Google dorking with AI extraction`;
    
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
