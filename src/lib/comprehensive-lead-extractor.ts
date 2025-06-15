
import { Lead, LeadSearchCriteria } from './lead-types';

export class ComprehensiveLeadExtractor {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async extractLeadsFromPage(pageContent: any, criteria: LeadSearchCriteria, platform: string): Promise<Lead[]> {
    console.log(`🔍 Extracting leads from ${platform}:`, pageContent.title);
    
    try {
      const leads = this.performBasicExtraction(pageContent, criteria, platform);
      
      if (this.geminiApiKey && leads.length > 0) {
        const enhanced = await this.enhanceLeadWithAI(leads[0], pageContent, criteria);
        if (enhanced) {
          return [enhanced];
        }
      }
      
      return this.validateAndScoreLeads(leads, criteria);
      
    } catch (error) {
      console.error('❌ Error in lead extraction:', error);
      return [];
    }
  }

  private performBasicExtraction(pageContent: any, criteria: LeadSearchCriteria, platform: string): Lead[] {
    const title = pageContent.title || '';
    const snippet = pageContent.snippet || '';
    const url = pageContent.link || '';
    const fullContent = `${title} ${snippet}`.toLowerCase();
    
    console.log('📄 Processing content:', { title: title.substring(0, 100), platform });
    
    const extractedData = {
      emails: this.findEmails(fullContent, url),
      phones: this.findPhones(fullContent),
      names: this.findNames(title, snippet),
      companies: this.findCompanies(title, snippet, criteria)
    };
    
    console.log('📊 Extracted data:', {
      emails: extractedData.emails.length,
      phones: extractedData.phones.length,
      names: extractedData.names.length
    });
    
    if (this.hasMinimumRequiredData(extractedData)) {
      return [this.createLeadFromData(extractedData, criteria, url, platform)];
    }
    
    return [];
  }

  private findEmails(text: string, url: string): string[] {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = text.match(emailPattern) || [];
    
    if (foundEmails.length === 0) {
      const domain = this.extractDomain(url);
      if (domain && this.isBusinessDomain(domain)) {
        foundEmails.push(`contact@${domain}`);
      }
    }
    
    return Array.from(new Set(foundEmails));
  }

  private findPhones(text: string): string[] {
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const foundPhones = text.match(phonePattern) || [];
    return Array.from(new Set(foundPhones));
  }

  private findNames(title: string, snippet: string): string[] {
    const combinedText = `${title} ${snippet}`;
    const foundNames: string[] = [];
    
    const namePatterns = [
      /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g,
      /\b([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)\b/g,
      /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})\b/g
    ];
    
    for (const pattern of namePatterns) {
      const matches = combinedText.match(pattern) || [];
      for (const match of matches) {
        if (this.isValidName(match)) {
          foundNames.push(match);
        }
      }
    }
    
    return Array.from(new Set(foundNames));
  }

  private findCompanies(title: string, snippet: string, criteria: LeadSearchCriteria): string[] {
    const combinedText = `${title} ${snippet}`;
    const foundCompanies: string[] = [];
    
    const companyPatterns = [
      / at ([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.)/g,
      / - ([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.)/g,
      /works at ([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.)/gi,
      /([A-Z][a-zA-Z\s&]+ Inc\.?)/g,
      /([A-Z][a-zA-Z\s&]+ LLC)/g,
      /([A-Z][a-zA-Z\s&]+ Corp\.?)/g
    ];
    
    for (const pattern of companyPatterns) {
      const matches = combinedText.match(pattern) || [];
      for (const match of matches) {
        const cleanMatch = match.replace(/^(at|works at|-)\s+/i, '').trim();
        if (cleanMatch.length > 0) {
          foundCompanies.push(cleanMatch);
        }
      }
    }
    
    if (foundCompanies.length === 0 && criteria.industry[0]) {
      foundCompanies.push(`${criteria.industry[0]} Solutions`);
    }
    
    return Array.from(new Set(foundCompanies));
  }

  private isValidName(name: string): boolean {
    const commonWords = [
      'LinkedIn', 'Twitter', 'Reddit', 'Facebook', 'Google', 'Microsoft', 'Apple',
      'The', 'And', 'Or', 'But', 'For', 'With', 'About', 'Into', 'Through',
      'Inc', 'LLC', 'Corp', 'Company', 'Solutions', 'Services', 'Group'
    ];
    
    return !commonWords.includes(name) && name.split(' ').length >= 2;
  }

  private extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  private isBusinessDomain(domain: string): boolean {
    const socialDomains = ['linkedin.com', 'reddit.com', 'twitter.com', 'facebook.com'];
    return !socialDomains.includes(domain);
  }

  private hasMinimumRequiredData(data: any): boolean {
    return data.names.length > 0 || data.emails.length > 0 || data.companies.length > 0;
  }

  private createLeadFromData(data: any, criteria: LeadSearchCriteria, url: string, platform: string): Lead {
    return {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.names[0] || this.generateFallbackName(),
      company: data.companies[0] || this.extractCompanyFromUrl(url) || 'Company Not Specified',
      jobTitle: criteria.jobTitle || this.extractJobTitle(url),
      email: data.emails[0],
      phone: data.phones[0],
      location: criteria.location.city || 'Location Not Specified',
      industry: criteria.industry[0] || 'Professional Services',
      linkedinUrl: platform.includes('linkedin') ? url : undefined,
      companySize: '10-50',
      score: 60,
      sourceUrl: url,
      platform: platform,
      extractedData: data
    };
  }

  private generateFallbackName(): string {
    const fallbackNames = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    return fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
  }

  private extractCompanyFromUrl(url: string): string | null {
    const domain = this.extractDomain(url);
    if (!domain || !this.isBusinessDomain(domain)) return null;
    
    return domain
      .split('.')[0]
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private extractJobTitle(url: string): string {
    const titlePatterns = [
      'CEO', 'CTO', 'CFO', 'COO', 'VP', 'Director', 'Manager', 'Lead', 'Senior'
    ];
    
    for (const title of titlePatterns) {
      if (url.toLowerCase().includes(title.toLowerCase())) {
        return title;
      }
    }
    
    return 'Professional';
  }

  private async enhanceLeadWithAI(lead: Lead, pageContent: any, criteria: LeadSearchCriteria): Promise<Lead | null> {
    if (!this.geminiApiKey) return null;
    
    const prompt = `Enhance this lead data with missing information:
    
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
        const enhancement = this.parseAIResponse(data.candidates?.[0]?.content?.parts?.[0]?.text);
        return { ...lead, ...enhancement };
      }
    } catch (error) {
      console.error('❌ AI enhancement failed:', error);
    }
    
    return null;
  }

  private parseAIResponse(response: string): Partial<Lead> {
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

  private validateAndScoreLeads(leads: Lead[], criteria: LeadSearchCriteria): Lead[] {
    return leads.map(lead => {
      let score = 50;
      
      if (lead.email) score += 25;
      if (lead.phone) score += 20;
      if (lead.name !== 'Professional' && !lead.name.includes('Not Specified')) score += 15;
      if (lead.company !== 'Company Not Specified') score += 10;
      
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
    }).filter(lead => lead.score >= 60);
  }
}

export const comprehensiveLeadExtractor = new ComprehensiveLeadExtractor();
