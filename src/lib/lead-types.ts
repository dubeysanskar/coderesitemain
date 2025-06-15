
export interface LeadSearchCriteria {
  industry: string;
  location: string;
  companySize: string;
  jobTitle: string;
  keywords: string;
  emailRequired: boolean;
  phoneRequired: boolean;
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
}

export interface LeadGenerationResult {
  leads: Lead[];
  totalCount: number;
  searchCriteria: LeadSearchCriteria;
  generatedAt: string;
}
