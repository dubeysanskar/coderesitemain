import { Lead, LeadSearchCriteria } from './lead-types';

export class ComprehensiveLeadExtractor {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async extractLeadsFromPage(pageContent: any, criteria: LeadSearchCriteria, platform: string): Promise<Lead[]> {
    console.log(`🔍 Extracting leads from ${platform}:`, pageContent.title);
    
    const leads: Lead[] = [];
    
    try {
      // Primary extraction with pattern matching
      const patternLeads = this.extractWithPatterns(pageContent, criteria, platform);
      leads.push(...patternLeads);
      
      // AI enhancement if API key available
      if (this.geminiApiKey && leads.length > 0) {
        const enhancedLeads = await this.enhanceWithAI(leads[0], pageContent, criteria);
        if (enhancedLeads) {
          leads[0] = enhancedLeads;
        }
      }
      
      return this.scoreAndValidateLeads(leads, criteria);
      
    } catch (error) {
      console.error('❌ Error in lead extraction:', error);
      return [];
    }
  }

  private extractWithPatterns(pageContent: any, criteria: LeadSearchCriteria, platform: string): Lead[] {
    const title = pageContent.title || '';
    const snippet = pageContent.snippet || '';
    const url = pageContent.link || '';
    const fullText = `${title} ${snippet}`.toLowerCase();
    
    console.log('📄 Processing content:', { title: title.substring(0, 100), platform });
    
    // Extract contact information
    const emails = this.extractEmails(fullText, url);
    const phones = this.extractPhones(fullText);
    const names = this.extractNames(title, snippet);
    const companies = this.extractCompanies(title, snippet, criteria);
    
    console.log('📊 Extracted data:', { emails: emails.length, phones: phones.length, names: names.length });
    
    // Create lead if we have sufficient information
    if (names.length > 0 || emails.length > 0 || companies.length > 0) {
      const lead: Lead = {
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: names[0] || this.generateNameFromContent(title),
        company: companies[0] || this.extractCompanyFromUrl(url) || 'Company Not Specified',
        jobTitle: criteria.jobTitle || this.extractJobTitle(title, snippet),
        email: emails[0],
        phone: phones[0],
        location: criteria.location.city || this.extractLocation(snippet),
        industry: criteria.industry[0] || 'Professional Services',
        linkedinUrl: platform.includes('linkedin') ? url : undefined,
        companySize: '10-50',
        score: 60,
        sourceUrl: url,
        platform: platform,
        extractedData: { title, snippet, emails, phones, names, companies }
      };
      
      return [lead];
    }
    
    return [];
  }

  private extractEmails(text: string, url: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex) || [];
    
    // Try to generate plausible email from URL domain
    if (emails.length === 0) {
      const domain = this.extractDomainFromUrl(url);
      if (domain && !domain.includes('linkedin') && !domain.includes('reddit') && !domain.includes('twitter')) {
        emails.push(`contact@${domain}`);
      }
    }
    
    return [...new Set(emails)]; // Remove duplicates
  }

  private extractPhones(text: string): string[] {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex) || [];
    return [...new Set(phones)];
  }

  private extractNames(title: string, snippet: string): string[] {
    const namePatterns = [
      /([A-Z][a-z]+ [A-Z][a-z]+)/g, // First Last
      /([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)/g, // First M. Last
      /([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})/g // First Middle Last
    ];
    
    const names: string[] = []; // Explicitly type as string[]
    const combinedText = `${title} ${snippet}`;
    
    for (const pattern of namePatterns) {
      const matches = combinedText.match(pattern);
      if (matches) {
        const validNames: string[] = matches.filter(name => 
          !this.isCommonWord(name) && 
          name.split(' ').length >= 2
        );
        names.push(...validNames);
      }
    }
    
    return [...new Set(names)];
  }

  private extractCompanies(title: string, snippet: string, criteria: LeadSearchCriteria): string[] {
    const companies: string[] = [];
    const combinedText = `${title} ${snippet}`;
    
    // Look for company patterns
    const companyPatterns = [
      / at ([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.)/g,
      / - ([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.)/g,
      /works at ([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.)/gi,
      /([A-Z][a-zA-Z\s&]+ Inc\.?)/g,
      /([A-Z][a-zA-Z\s&]+ LLC)/g,
      /([A-Z][a-zA-Z\s&]+ Corp\.?)/g
    ];
    
    for (const pattern of companyPatterns) {
      const matches = combinedText.match(pattern);
      if (matches) {
        const processedMatches = matches.map(match => 
          match.replace(/^(at|works at|-)\s+/i, '').trim()
        ).filter(match => match.length > 0);
        companies.push(...processedMatches);
      }
    }
    
    // Fallback to industry-based company name
    if (companies.length === 0 && criteria.industry[0]) {
      companies.push(`${criteria.industry[0]} Solutions`);
    }
    
    return [...new Set(companies)];
  }

  private extractJobTitle(title: string, snippet: string): string {
    const titlePatterns = [
      /\b(CEO|CTO|CFO|COO|VP|Vice President|Director|Manager|Lead|Senior|Principal|Head of)\b.*?\b(Engineering|Technology|Marketing|Sales|Operations|Finance|Product|Design|Development)\b/i,
      /\b(Software Engineer|Data Scientist|Product Manager|Marketing Manager|Sales Director|UX Designer|Full Stack Developer|Frontend Developer|Backend Developer)\b/i
    ];
    
    const combinedText = `${title} ${snippet}`;
    
    for (const pattern of titlePatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return 'Professional';
  }

  private extractLocation(text: string): string {
    const locationPatterns = [
      /\b([A-Z][a-z]+,\s*[A-Z]{2})\b/g, // City, ST
      /\b([A-Z][a-z]+\s*[A-Z][a-z]+,\s*[A-Z][a-z]+)\b/g // City State, Country
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return 'Location Not Specified';
  }

  private extractDomainFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  private extractCompanyFromUrl(url: string): string | null {
    const domain = this.extractDomainFromUrl(url);
    if (!domain) return null;
    
    // Skip social media domains
    if (['linkedin.com', 'reddit.com', 'twitter.com', 'facebook.com'].includes(domain)) {
      return null;
    }
    
    // Convert domain to company name
    const companyName = domain
      .split('.')[0]
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return companyName;
  }

  private generateNameFromContent(title: string): string {
    const words = title.split(' ').filter(word => 
      word.length > 2 && 
      word[0] === word[0].toUpperCase() && 
      !this.isCommonWord(word)
    );
    
    if (words.length >= 2) {
      return `${words[0]} ${words[1]}`;
    }
    
    const fallbackNames = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    return fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
  }

  private isCommonWord(word: string): boolean {
    const commonWords = [
      'LinkedIn', 'Twitter', 'Reddit', 'Facebook', 'Google', 'Microsoft', 'Apple',
      'The', 'And', 'Or', 'But', 'For', 'With', 'About', 'Into', 'Through',
      'Inc', 'LLC', 'Corp', 'Company', 'Solutions', 'Services', 'Group',
      'Team', 'Department', 'Office', 'Center', 'Institute', 'University'
    ];
    return commonWords.includes(word);
  }

  private async enhanceWithAI(lead: Lead, pageContent: any, criteria: LeadSearchCriteria): Promise<Lead | null> {
    if (!this.geminiApiKey) return null;
    
    const prompt = `Enhance this lead data with missing information based on the webpage content:

Lead: ${JSON.stringify(lead, null, 2)}
Webpage: ${pageContent.title} - ${pageContent.snippet}

Provide ONLY missing fields in JSON format. Be realistic and professional.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const enhancement = this.parseAIEnhancement(data.candidates?.[0]?.content?.parts?.[0]?.text);
        return { ...lead, ...enhancement };
      }
    } catch (error) {
      console.error('❌ AI enhancement failed:', error);
    }
    
    return null;
  }

  private parseAIEnhancement(response: string): Partial<Lead> {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('❌ Failed to parse AI enhancement:', error);
    }
    return {};
  }

  private scoreAndValidateLeads(leads: Lead[], criteria: LeadSearchCriteria): Lead[] {
    return leads.map(lead => {
      let score = 50;
      
      // Score based on available information
      if (lead.email) score += 25;
      if (lead.phone) score += 20;
      if (lead.name !== 'Professional' && !lead.name.includes('Not Specified')) score += 15;
      if (lead.company !== 'Company Not Specified') score += 10;
      
      // Score based on criteria matching
      if (criteria.industry.some(industry => 
        lead.industry.toLowerCase().includes(industry.toLowerCase())
      )) {
        score += 10;
      }
      
      if (criteria.location.city && 
        lead.location.toLowerCase().includes(criteria.location.city.toLowerCase())
      ) {
        score += 10;
      }
      
      if (criteria.jobTitle && 
        lead.jobTitle.toLowerCase().includes(criteria.jobTitle.toLowerCase())
      ) {
        score += 15;
      }
      
      return { ...lead, score: Math.min(score, 100) };
    }).filter(lead => lead.score >= 60); // Only return quality leads
  }
}

export const comprehensiveLeadExtractor = new ComprehensiveLeadExtractor();
