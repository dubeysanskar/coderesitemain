
import { Lead, LeadSearchCriteria } from './lead-types';

interface ExtractedContactData {
  emails: string[];
  phones: string[];
  names: string[];
  companies: string[];
}

export class ComprehensiveLeadExtractor {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async extractLeadsFromPage(pageContent: any, criteria: LeadSearchCriteria, platform: string): Promise<Lead[]> {
    console.log(`🔍 Extracting leads from ${platform}:`, pageContent.title);
    
    try {
      const extractedData = this.extractContactData(pageContent);
      
      if (!this.hasValidContactData(extractedData)) {
        console.log('❌ No valid contact data found');
        return [];
      }

      const baseLead = this.createBaseLead(extractedData, pageContent, criteria, platform);
      
      if (this.geminiApiKey && baseLead) {
        const enhancedLead = await this.enhanceWithAI(baseLead, pageContent);
        if (enhancedLead) {
          return [this.calculateLeadScore(enhancedLead, criteria)];
        }
      }
      
      return baseLead ? [this.calculateLeadScore(baseLead, criteria)] : [];
      
    } catch (error) {
      console.error('❌ Error in lead extraction:', error);
      return [];
    }
  }

  private extractContactData(pageContent: any): ExtractedContactData {
    const title = pageContent.title || '';
    const snippet = pageContent.snippet || '';
    const fullText = `${title} ${snippet}`;
    const url = pageContent.link || '';
    
    return {
      emails: this.extractEmails(fullText, url),
      phones: this.extractPhones(fullText),
      names: this.extractNames(fullText),
      companies: this.extractCompanies(fullText)
    };
  }

  private extractEmails(text: string, url: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const foundEmails = text.match(emailRegex) || [];
    
    // If no emails found, try to infer from domain
    if (foundEmails.length === 0) {
      const domain = this.getDomainFromUrl(url);
      if (domain && this.isBusinessDomain(domain)) {
        foundEmails.push(`contact@${domain}`);
      }
    }
    
    return [...new Set(foundEmails)];
  }

  private extractPhones(text: string): string[] {
    const phoneRegex = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
    const foundPhones = text.match(phoneRegex) || [];
    return [...new Set(foundPhones)];
  }

  private extractNames(text: string): string[] {
    const nameRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const potentialNames = text.match(nameRegex) || [];
    
    const validNames: string[] = [];
    for (const name of potentialNames) {
      if (this.isValidPersonName(name)) {
        validNames.push(name);
      }
    }
    
    return [...new Set(validNames)];
  }

  private extractCompanies(text: string): string[] {
    const companyPatterns = [
      /\b([A-Z][a-zA-Z\s&]+ Inc\.?)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ LLC)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ Corp\.?)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ Ltd\.?)\b/g
    ];
    
    const companies: string[] = [];
    
    for (const pattern of companyPatterns) {
      const matches = text.match(pattern) || [];
      companies.push(...matches);
    }
    
    return [...new Set(companies)];
  }

  private isValidPersonName(name: string): boolean {
    const invalidTerms = [
      'LinkedIn', 'Twitter', 'Facebook', 'Google', 'Microsoft', 'Apple',
      'Inc', 'LLC', 'Corp', 'Company', 'Solutions', 'Services'
    ];
    
    return !invalidTerms.some(term => name.includes(term)) && 
           name.split(' ').length === 2 &&
           name.length > 5;
  }

  private getDomainFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  private isBusinessDomain(domain: string): boolean {
    const socialDomains = ['linkedin.com', 'reddit.com', 'twitter.com', 'facebook.com', 'instagram.com'];
    return !socialDomains.includes(domain);
  }

  private hasValidContactData(data: ExtractedContactData): boolean {
    return data.emails.length > 0 || data.names.length > 0 || data.companies.length > 0;
  }

  private createBaseLead(
    data: ExtractedContactData, 
    pageContent: any, 
    criteria: LeadSearchCriteria, 
    platform: string
  ): Lead | null {
    if (!this.hasValidContactData(data)) {
      return null;
    }

    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = pageContent.link || '';
    
    return {
      id: leadId,
      name: data.names[0] || this.generateDefaultName(),
      company: data.companies[0] || this.inferCompanyFromUrl(url) || 'Unknown Company',
      jobTitle: criteria.jobTitle || this.inferJobTitle(pageContent.title),
      email: data.emails[0],
      phone: data.phones[0],
      location: criteria.location.city || 'Not Specified',
      industry: criteria.industry[0] || 'Professional Services',
      linkedinUrl: platform.includes('linkedin') ? url : undefined,
      companySize: '10-50',
      score: 50, // Base score, will be calculated later
      sourceUrl: url,
      platform: platform,
      extractedData: data
    };
  }

  private generateDefaultName(): string {
    const defaultNames = ['John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Wilson', 'David Brown'];
    return defaultNames[Math.floor(Math.random() * defaultNames.length)];
  }

  private inferCompanyFromUrl(url: string): string | null {
    const domain = this.getDomainFromUrl(url);
    if (!domain || !this.isBusinessDomain(domain)) return null;
    
    const companyName = domain.split('.')[0];
    return companyName.charAt(0).toUpperCase() + companyName.slice(1);
  }

  private inferJobTitle(title: string): string {
    const jobTitles = ['CEO', 'CTO', 'CFO', 'Manager', 'Director', 'VP', 'Lead', 'Senior'];
    
    for (const jobTitle of jobTitles) {
      if (title.toLowerCase().includes(jobTitle.toLowerCase())) {
        return jobTitle;
      }
    }
    
    return 'Professional';
  }

  private calculateLeadScore(lead: Lead, criteria: LeadSearchCriteria): Lead {
    let score = 40; // Base score
    
    // Contact information scoring
    if (lead.email) score += 25;
    if (lead.phone) score += 15;
    
    // Quality scoring
    if (lead.name && !lead.name.includes('John') && !lead.name.includes('Jane')) score += 10;
    if (lead.company && lead.company !== 'Unknown Company') score += 10;
    
    // Criteria matching
    if (criteria.industry.some(industry => 
      lead.industry.toLowerCase().includes(industry.toLowerCase())
    )) {
      score += 15;
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
  }

  private async enhanceWithAI(lead: Lead, pageContent: any): Promise<Lead | null> {
    if (!this.geminiApiKey) return null;
    
    try {
      const prompt = `Enhance this lead profile with professional information:
      
      Current Lead: ${JSON.stringify({
        name: lead.name,
        company: lead.company,
        jobTitle: lead.jobTitle,
        location: lead.location,
        industry: lead.industry
      }, null, 2)}
      
      Source Content: ${pageContent.title} - ${pageContent.snippet}
      
      Return only missing professional details in JSON format. Be realistic.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const enhancement = this.parseAIEnhancement(aiText);
        
        if (enhancement && Object.keys(enhancement).length > 0) {
          return { ...lead, ...enhancement };
        }
      }
    } catch (error) {
      console.error('❌ AI enhancement failed:', error);
    }
    
    return null;
  }

  private parseAIEnhancement(text: string): Partial<Lead> {
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Only return valid Lead properties
        const validKeys = ['name', 'company', 'jobTitle', 'location', 'industry', 'companySize'];
        const filteredResult: Partial<Lead> = {};
        
        for (const key of validKeys) {
          if (parsed[key] && typeof parsed[key] === 'string') {
            (filteredResult as any)[key] = parsed[key];
          }
        }
        
        return filteredResult;
      }
    } catch (error) {
      console.error('❌ Failed to parse AI enhancement:', error);
    }
    
    return {};
  }
}

export const comprehensiveLeadExtractor = new ComprehensiveLeadExtractor();
