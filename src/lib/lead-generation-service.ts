
import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';

class LeadGenerationService {
  // Mock data for demonstration - in real implementation, this would call actual APIs
  private mockLeads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      company: 'TechCorp Inc.',
      jobTitle: 'Marketing Director',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      industry: 'Technology',
      linkedinUrl: 'https://linkedin.com/in/johnsmith',
      companySize: '100-500',
      score: 85
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'Digital Solutions Ltd.',
      jobTitle: 'CEO',
      email: 'sarah.j@digitalsolutions.com',
      location: 'New York, NY',
      industry: 'Digital Marketing',
      companySize: '50-100',
      score: 92
    },
    {
      id: '3',
      name: 'Mike Chen',
      company: 'StartupHub',
      jobTitle: 'Business Development Manager',
      email: 'mike.chen@startuphub.io',
      phone: '+1-555-0789',
      location: 'Austin, TX',
      industry: 'Technology',
      linkedinUrl: 'https://linkedin.com/in/mikechen',
      companySize: '10-50',
      score: 78
    }
  ];

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter mock leads based on criteria
    let filteredLeads = this.mockLeads.filter(lead => {
      const matchesIndustry = !criteria.industry || 
        lead.industry.toLowerCase().includes(criteria.industry.toLowerCase());
      
      const matchesLocation = !criteria.location || 
        lead.location.toLowerCase().includes(criteria.location.toLowerCase());
      
      const matchesCompanySize = !criteria.companySize || 
        lead.companySize === criteria.companySize;
      
      const matchesJobTitle = !criteria.jobTitle || 
        lead.jobTitle.toLowerCase().includes(criteria.jobTitle.toLowerCase());
      
      const matchesKeywords = !criteria.keywords || 
        lead.company.toLowerCase().includes(criteria.keywords.toLowerCase()) ||
        lead.name.toLowerCase().includes(criteria.keywords.toLowerCase());
      
      const hasEmail = !criteria.emailRequired || !!lead.email;
      const hasPhone = !criteria.phoneRequired || !!lead.phone;

      return matchesIndustry && matchesLocation && matchesCompanySize && 
             matchesJobTitle && matchesKeywords && hasEmail && hasPhone;
    });

    // Generate additional mock leads if needed
    if (filteredLeads.length < 3) {
      const additionalLeads = this.generateMockLeads(criteria, 5);
      filteredLeads = [...filteredLeads, ...additionalLeads];
    }

    return {
      leads: filteredLeads.slice(0, 10), // Limit to 10 results
      totalCount: filteredLeads.length,
      searchCriteria: criteria,
      generatedAt: new Date().toISOString()
    };
  }

  private generateMockLeads(criteria: LeadSearchCriteria, count: number): Lead[] {
    const names = ['Alex Rodriguez', 'Emma Wilson', 'David Brown', 'Lisa Davis', 'Tom Anderson'];
    const companies = ['InnovateX', 'GrowthPro', 'NextGen Solutions', 'ProBusiness', 'ScaleUp Inc.'];
    const jobTitles = ['Sales Manager', 'Marketing Director', 'VP of Sales', 'Business Owner', 'Head of Growth'];
    
    return Array.from({ length: count }, (_, index) => ({
      id: `mock-${Date.now()}-${index}`,
      name: names[index % names.length],
      company: companies[index % companies.length],
      jobTitle: criteria.jobTitle || jobTitles[index % jobTitles.length],
      email: criteria.emailRequired ? `contact${index}@company.com` : undefined,
      phone: criteria.phoneRequired ? `+1-555-${String(index).padStart(4, '0')}` : undefined,
      location: criteria.location || 'United States',
      industry: criteria.industry || 'Business',
      companySize: criteria.companySize || '50-100',
      score: Math.floor(Math.random() * 40) + 60
    }));
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Company', 'Job Title', 'Email', 'Phone', 'Location', 'Industry', 'Score'];
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
          lead.score
        ].join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    // For XLSX, return a simple format (in real implementation, use a library like xlsx)
    return 'XLSX export would be implemented with a proper library';
  }
}

export const leadGenerationService = new LeadGenerationService();
