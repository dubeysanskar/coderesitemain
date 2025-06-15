
export interface DorkPattern {
  name: string;
  pattern: string;
  description: string;
  sites?: string[];
}

export const GOOGLE_DORK_PATTERNS = {
  // Contact information patterns
  CONTACT_INFO: [
    {
      name: 'Email Directories',
      pattern: 'intext:"@{domain}" AND intext:"{role}" AND intext:"{location}"',
      description: 'Find email addresses with specific roles and locations'
    },
    {
      name: 'Contact Pages',
      pattern: 'inurl:contact AND intext:"{industry}" AND intext:"{location}"',
      description: 'Contact pages for specific industries'
    },
    {
      name: 'Staff Directories',
      pattern: 'intext:"staff directory" OR intext:"employee directory" AND intext:"{company_type}"',
      description: 'Employee directories for companies'
    }
  ],

  // Professional networks
  PROFESSIONAL: [
    {
      name: 'LinkedIn Profiles',
      pattern: 'site:linkedin.com/in AND intext:"{role}" AND intext:"{location}" AND intext:"{industry}"',
      description: 'LinkedIn profiles matching criteria',
      sites: ['linkedin.com']
    },
    {
      name: 'Company About Pages',
      pattern: 'inurl:about AND intext:"team" AND intext:"{industry}" AND intext:"{location}"',
      description: 'Company about pages with team information'
    },
    {
      name: 'Professional Bios',
      pattern: 'intext:"biography" OR intext:"bio" AND intext:"{role}" AND intext:"{location}"',
      description: 'Professional biographies'
    }
  ],

  // Business directories
  DIRECTORIES: [
    {
      name: 'Business Listings',
      pattern: 'site:yellowpages.com OR site:yelp.com AND intext:"{industry}" AND intext:"{location}"',
      description: 'Business directory listings',
      sites: ['yellowpages.com', 'yelp.com', 'google.com/maps']
    },
    {
      name: 'Chamber of Commerce',
      pattern: 'site:chamber.com OR intext:"chamber of commerce" AND intext:"{location}" AND intext:"{industry}"',
      description: 'Chamber of commerce listings'
    }
  ],

  // Social media and forums
  SOCIAL: [
    {
      name: 'Twitter Profiles',
      pattern: 'site:twitter.com AND intext:"{role}" AND intext:"{location}" AND intext:"email"',
      description: 'Twitter profiles with contact info',
      sites: ['twitter.com']
    },
    {
      name: 'Facebook Business Pages',
      pattern: 'site:facebook.com AND intext:"{industry}" AND intext:"{location}" AND intext:"contact"',
      description: 'Facebook business pages',
      sites: ['facebook.com']
    }
  ],

  // Company websites
  WEBSITES: [
    {
      name: 'Team Pages',
      pattern: 'inurl:team OR inurl:staff OR inurl:about AND intext:"{role}" AND intext:"{location}"',
      description: 'Company team and staff pages'
    },
    {
      name: 'Press Releases',
      pattern: 'intext:"press release" AND intext:"{company_type}" AND intext:"{location}" AND intext:"contact"',
      description: 'Press releases with contact information'
    }
  ]
};

export const CONTACT_DORKS = [
  'intext:"email" AND intext:"phone"',
  'intext:"contact us" AND intext:"@"',
  'intext:"reach out" AND intext:"call"',
  'inurl:contact AND intext:"@"',
  'intext:"get in touch" AND intext:"phone"'
];

export const LOCATION_MODIFIERS = [
  'intext:"{city}"',
  'intext:"{city}, {state}"',
  'intext:"{state}"',
  'near "{city}"',
  'location:"{city}"'
];

export const ROLE_PATTERNS = [
  'intitle:"{role}"',
  'intext:"{role}"',
  'intext:"position: {role}"',
  'intext:"title: {role}"',
  'intext:"{role} at"'
];
