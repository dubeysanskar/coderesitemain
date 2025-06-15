
import { LeadSearchCriteria } from './lead-types';
import { GOOGLE_DORK_PATTERNS, CONTACT_DORKS, LOCATION_MODIFIERS, ROLE_PATTERNS } from './google-dork-patterns';

interface DorkQuery {
  query: string;
  description: string;
  category: string;
}

export class AdvancedDorkBuilder {
  private criteria: LeadSearchCriteria;

  constructor(criteria: LeadSearchCriteria) {
    this.criteria = criteria;
  }

  generateDorkQueries(): DorkQuery[] {
    const queries: DorkQuery[] = [];

    // Generate contact-focused queries
    queries.push(...this.buildContactQueries());
    
    // Generate professional network queries
    queries.push(...this.buildProfessionalQueries());
    
    // Generate directory queries
    queries.push(...this.buildDirectoryQueries());
    
    // Generate social media queries
    queries.push(...this.buildSocialQueries());
    
    // Generate website queries
    queries.push(...this.buildWebsiteQueries());

    return queries;
  }

  private buildContactQueries(): DorkQuery[] {
    const queries: DorkQuery[] = [];
    
    for (const pattern of GOOGLE_DORK_PATTERNS.CONTACT_INFO) {
      let query = this.replacePlaceholders(pattern.pattern);
      
      // Add contact requirements
      query += ` AND (${CONTACT_DORKS.join(' OR ')})`;
      
      // Add location if specified
      if (this.criteria.location.city) {
        query += ` AND ${this.buildLocationFilter()}`;
      }

      queries.push({
        query,
        description: pattern.description,
        category: 'Contact Information'
      });
    }

    return queries;
  }

  private buildProfessionalQueries(): DorkQuery[] {
    const queries: DorkQuery[] = [];
    
    for (const pattern of GOOGLE_DORK_PATTERNS.PROFESSIONAL) {
      let query = this.replacePlaceholders(pattern.pattern);
      
      // Add email requirement
      query += ' AND (intext:"email" OR intext:"@" OR intext:"contact")';
      
      queries.push({
        query,
        description: pattern.description,
        category: 'Professional Networks'
      });
    }

    return queries;
  }

  private buildDirectoryQueries(): DorkQuery[] {
    const queries: DorkQuery[] = [];
    
    for (const pattern of GOOGLE_DORK_PATTERNS.DIRECTORIES) {
      let query = this.replacePlaceholders(pattern.pattern);
      
      // Add contact info requirement
      query += ' AND (intext:"phone" OR intext:"email" OR intext:"contact")';
      
      queries.push({
        query,
        description: pattern.description,
        category: 'Business Directories'
      });
    }

    return queries;
  }

  private buildSocialQueries(): DorkQuery[] {
    const queries: DorkQuery[] = [];
    
    for (const pattern of GOOGLE_DORK_PATTERNS.SOCIAL) {
      const query = this.replacePlaceholders(pattern.pattern);
      
      queries.push({
        query,
        description: pattern.description,
        category: 'Social Media'
      });
    }

    return queries;
  }

  private buildWebsiteQueries(): DorkQuery[] {
    const queries: DorkQuery[] = [];
    
    for (const pattern of GOOGLE_DORK_PATTERNS.WEBSITES) {
      let query = this.replacePlaceholders(pattern.pattern);
      
      // Add email requirement
      query += ' AND (intext:"@" OR intext:"email")';
      
      queries.push({
        query,
        description: pattern.description,
        category: 'Company Websites'
      });
    }

    return queries;
  }

  private replacePlaceholders(pattern: string): string {
    let query = pattern;
    
    // Replace industry
    if (this.criteria.industry.length > 0) {
      const industryTerms = this.criteria.industry.map(ind => `"${ind}"`).join(' OR ');
      query = query.replace('{industry}', this.criteria.industry[0]);
      query = query.replace('{company_type}', this.criteria.industry[0]);
    }
    
    // Replace role
    if (this.criteria.jobTitle) {
      query = query.replace('{role}', this.criteria.jobTitle);
    }
    
    // Replace location
    if (this.criteria.location.city) {
      query = query.replace('{location}', this.criteria.location.city);
      query = query.replace('{city}', this.criteria.location.city);
    }
    
    if (this.criteria.location.state) {
      query = query.replace('{state}', this.criteria.location.state);
    }
    
    // Replace domain for email searches
    if (this.criteria.keywords.length > 0) {
      query = query.replace('{domain}', this.criteria.keywords[0]);
    }
    
    return query;
  }

  private buildLocationFilter(): string {
    const parts = [];
    
    if (this.criteria.location.city) {
      parts.push(`"${this.criteria.location.city}"`);
    }
    
    if (this.criteria.location.state) {
      parts.push(`"${this.criteria.location.state}"`);
    }
    
    if (this.criteria.location.country) {
      parts.push(`"${this.criteria.location.country}"`);
    }
    
    return `(${parts.join(' OR ')})`;
  }

  getOptimizedQuery(): string {
    const queries = this.generateDorkQueries();
    
    // Return the most comprehensive query
    if (queries.length > 0) {
      return queries[0].query;
    }
    
    // Fallback basic query
    return this.buildBasicDorkQuery();
  }

  private buildBasicDorkQuery(): string {
    let baseQuery = 'site:linkedin.com/in OR site:about.me';
    
    // Add industry filter
    if (this.criteria.industry.length > 0) {
      baseQuery += ` AND (${this.criteria.industry.map(ind => `"${ind}"`).join(' OR ')})`;
    }
    
    // Add role filter
    if (this.criteria.jobTitle) {
      baseQuery += ` AND "${this.criteria.jobTitle}"`;
    }
    
    // Add location filter
    if (this.criteria.location.city) {
      baseQuery += ` AND "${this.criteria.location.city}"`;
    }
    
    // Add contact requirement
    baseQuery += ' AND (intext:"email" OR intext:"@") AND (intext:"phone" OR intext:"contact")';
    
    return baseQuery;
  }
}
