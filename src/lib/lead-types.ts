
export interface LeadSearchCriteria {
  industry: string[];
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  companySize: string;
  jobTitle: string;
  keywords: string[];
  field: string;
  customTags: string[];
  emailRequired: boolean;
  phoneRequired: boolean;
  searchDepth: number; // Pages 1-5
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location: string;
  industry: string;
  linkedinUrl?: string;
  companySize: string;
  score: number;
  sourceUrl?: string;
}

export interface LeadGenerationResult {
  leads: Lead[];
  totalCount: number;
  searchCriteria: LeadSearchCriteria;
  generatedAt: string;
  googleDorkQuery: string;
}

export interface GoogleDorkQuery {
  query: string;
  breakdown: {
    baseQuery: string;
    industryFilter: string;
    locationFilter: string;
    roleFilter: string;
    keywordFilters: string[];
    fieldFilter: string;
    customTagFilters: string[];
    contactRequirements: string;
  };
}
