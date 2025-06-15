import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';
import { comprehensiveLeadExtractor } from './comprehensive-lead-extractor';

class NewLeadGenerationService {
  private googleApiKey: string;
  private googleCx: string;

  constructor() {
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.googleCx = import.meta.env.VITE_GOOGLE_CX || '';
    
    console.log('🔑 API Keys Check:', {
      hasGoogleKey: !!this.googleApiKey,
      hasGoogleCx: !!this.googleCx
    });
  }

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('🚀 Starting comprehensive lead generation with criteria:', criteria);
    
    this.validateApiKeys();
    
    try {
      const platforms = criteria.targetPlatforms || ['linkedin', 'reddit', 'twitter'];
      const allLeads: Lead[] = [];
      const platformResults: { [platform: string]: { count: number; queries: string[] } } = {};
      
      // Generate leads for each platform
      for (const platform of platforms) {
        console.log(`🎯 Processing platform: ${platform}`);
        
        const platformQueries = this.buildPlatformQueries(criteria, platform);
        platformResults[platform] = { count: 0, queries: platformQueries };
        
        const platformLeads = await this.searchPlatform(platformQueries, criteria, platform);
        allLeads.push(...platformLeads);
        platformResults[platform].count = platformLeads.length;
        
        console.log(`✅ Found ${platformLeads.length} leads on ${platform}`);
        
        // Rate limiting between platforms
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Remove duplicates and sort by score
      const uniqueLeads = this.removeDuplicatesAcrossPlatforms(allLeads);
      const sortedLeads = uniqueLeads.sort((a, b) => b.score - a.score);
      
      console.log(`📊 Final results: ${sortedLeads.length} unique leads across ${platforms.length} platforms`);
      
      return {
        leads: sortedLeads,
        totalCount: sortedLeads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString(),
        googleDorkQuery: Object.values(platformResults).flatMap(r => r.queries).join(' | '),
        platformResults
      };
      
    } catch (error) {
      console.error('❌ Lead generation failed:', error);
      throw new Error(`Lead generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPlatformQueries(criteria: LeadSearchCriteria, platform: string): string[] {
    const queries: string[] = [];
    const industry = criteria.industry[0] || '';
    const location = criteria.location.city || '';
    const state = criteria.location.state || '';
    const role = criteria.jobTitle || '';
    const timeFilter = this.buildTimeFilter(criteria.timeRange);
    
    const locationStr = [location, state].filter(Boolean).join(' ');
    
    console.log('🏗️ Building queries for platform:', platform, { industry, locationStr, role, timeFilter });
    
    // Platform-specific query building
    if (platform === 'linkedin' || platform.includes('linkedin')) {
      if (industry && locationStr) {
        queries.push(`site:linkedin.com/in "${industry}" "${locationStr}"${timeFilter}`);
      }
      if (role && locationStr) {
        queries.push(`site:linkedin.com/in "${role}" "${locationStr}"${timeFilter}`);
      }
      if (industry && role) {
        queries.push(`site:linkedin.com/in "${industry}" "${role}"${timeFilter}`);
      }
      // Email-focused LinkedIn query
      if (industry) {
        queries.push(`site:linkedin.com/in "${industry}" (email OR contact OR @)${timeFilter}`);
      }
    }
    
    else if (platform === 'reddit' || platform.includes('reddit')) {
      if (industry) {
        queries.push(`site:reddit.com "${industry}" "${locationStr || 'hiring'}" (job OR work OR opportunity OR email)${timeFilter}`);
      }
      if (role) {
        queries.push(`site:reddit.com "${role}" "${locationStr || 'looking'}" (contact OR email OR phone)${timeFilter}`);
      }
      // Specific subreddits
      queries.push(`(site:reddit.com/r/jobs OR site:reddit.com/r/forhire) "${industry || role}" "${locationStr || 'remote'}"${timeFilter}`);
    }
    
    else if (platform === 'twitter' || platform.includes('twitter')) {
      if (industry && locationStr) {
        queries.push(`site:twitter.com "${industry}" "${locationStr}" (hiring OR jobs OR contact OR email)${timeFilter}`);
      }
      if (role) {
        queries.push(`site:twitter.com "${role}" "${locationStr || 'available'}" (email OR contact OR DM)${timeFilter}`);
      }
    }
    
    else if (platform === 'github' || platform.includes('github')) {
      if (industry || role) {
        queries.push(`site:github.com "${industry || role}" "${locationStr}" (email OR contact)${timeFilter}`);
      }
    }
    
    else {
      // Custom platform/domain
      const domain = platform;
      if (industry && locationStr) {
        queries.push(`site:${domain} "${industry}" "${locationStr}" (contact OR email OR phone)${timeFilter}`);
      }
      if (role) {
        queries.push(`site:${domain} "${role}" "${locationStr || 'professional'}" (email OR contact)${timeFilter}`);
      }
    }
    
    // Fallback query if no specific queries generated
    if (queries.length === 0) {
      const searchTerms = [industry, locationStr, role].filter(Boolean);
      if (searchTerms.length > 0 && platform) {
        const siteQuery = platform.includes('.') ? `site:${platform}` : `site:${platform}.com`;
        queries.push(`${siteQuery} ${searchTerms.join(' ')} (email OR contact)${timeFilter}`);
      }
    }
    
    console.log(`✅ Built ${queries.length} queries for ${platform}:`, queries);
    return queries;
  }

  private buildTimeFilter(timeRange?: string): string {
    if (!timeRange) return '';
    
    // Google Search parameter format for time filtering
    const timeMap: { [key: string]: string } = {
      'h': '&tbs=qdr:h',    // Past hour
      'h10': '&tbs=qdr:h', // Past 10 hours (use h as closest)
      'd': '&tbs=qdr:d',    // Past day
      'd3': '&tbs=qdr:d3',  // Past 3 days
      'w': '&tbs=qdr:w',    // Past week
      'm': '&tbs=qdr:m',    // Past month
      'y': '&tbs=qdr:y'     // Past year
    };
    
    return timeMap[timeRange] || '';
  }

  private async searchPlatform(queries: string[], criteria: LeadSearchCriteria, platform: string): Promise<Lead[]> {
    const leads: Lead[] = [];
    const maxPages = criteria.maxPages || 3;
    
    for (const query of queries.slice(0, 2)) { // Limit to 2 queries per platform
      console.log(`🔍 Executing query for ${platform}: ${query}`);
      
      // Search multiple pages for this query
      for (let page = 0; page < maxPages; page++) {
        const startIndex = page * 10 + 1;
        
        try {
          const results = await this.executeGoogleSearch(query, startIndex);
          console.log(`📊 Query page ${page + 1} returned ${results.length} results`);
          
          if (results.length === 0) break; // No more results
          
          // Extract leads from search results
          const pageLeads = await comprehensiveLeadExtractor.extractLeadsFromPage(
            results, criteria, platform
          );
          
          // Process each result individually for better extraction
          for (const result of results) {
            const resultLeads = await comprehensiveLeadExtractor.extractLeadsFromPage(
              result, criteria, platform
            );
            leads.push(...resultLeads);
          }
          
          console.log(`✅ Extracted ${pageLeads.length} leads from page ${page + 1}`);
          
          // Rate limiting between pages
          await new Promise(resolve => setTimeout(resolve, 1500));
          
        } catch (error) {
          console.error(`❌ Query page ${page + 1} failed:`, error);
          break; // Stop trying more pages for this query
        }
      }
      
      // Rate limiting between queries
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return leads;
  }

  private async executeGoogleSearch(query: string, startIndex: number = 1): Promise<any[]> {
    const timeFilter = query.includes('&tbs=') ? query.split('&tbs=')[1] : '';
    const cleanQuery = query.includes('&tbs=') ? query.split('&tbs=')[0] : query;
    
    let searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(cleanQuery)}&num=10&start=${startIndex}`;
    
    if (timeFilter) {
      searchUrl += `&sort=date:r:${this.getDateFilter(timeFilter)}`;
    }
    
    console.log('🌐 Making Google Search API request...');
    console.log('🔗 Clean query:', cleanQuery);
    
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

  private getDateFilter(timeFilter: string): string {
    const now = new Date();
    switch (timeFilter) {
      case 'qdr:h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString().split('T')[0];
      case 'qdr:d': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case 'qdr:w': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case 'qdr:m': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case 'qdr:y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
  }

  private removeDuplicatesAcrossPlatforms(leads: Lead[]): Lead[] {
    const seen = new Map();
    
    return leads.filter(lead => {
      // Create a key based on name and company, or email if available
      const key = lead.email || `${lead.name}-${lead.company}`;
      
      if (seen.has(key)) {
        // Keep the lead with higher score
        const existing = seen.get(key);
        if (lead.score > existing.score) {
          seen.set(key, lead);
          return true;
        }
        return false;
      }
      
      seen.set(key, lead);
      return true;
    });
  }

  private validateApiKeys(): void {
    if (!this.googleApiKey) {
      throw new Error('Google API key is missing. Set VITE_GOOGLE_API_KEY environment variable.');
    }
    if (!this.googleCx) {
      throw new Error('Google CX is missing. Set VITE_GOOGLE_CX environment variable.');
    }
  }

  generateDorkPreview(criteria: LeadSearchCriteria): string {
    const platforms = criteria.targetPlatforms || ['linkedin', 'reddit', 'twitter'];
    
    let preview = '🔍 Google Dork Queries by Platform:\n\n';
    
    platforms.forEach((platform, index) => {
      const queries = this.buildPlatformQueries(criteria, platform);
      preview += `${index + 1}. ${platform.toUpperCase()}\n`;
      queries.forEach((query, qIndex) => {
        preview += `   ${qIndex + 1}. ${query}\n`;
      });
      preview += '\n';
    });
    
    preview += `📊 Total Platforms: ${platforms.length}\n`;
    preview += `📄 Search Pages per Query: ${criteria.maxPages || 3}\n`;
    preview += `⏰ Time Range: ${criteria.timeRange || 'All time'}`;
    
    return preview;
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Company', 'Job Title', 'Email', 'Phone', 'Location', 'Industry', 'Platform', 'Score', 'Source URL'];
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
          lead.platform || '',
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
