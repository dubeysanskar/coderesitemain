
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadSearchCriteria, LeadGenerationResult } from '@/lib/lead-types';
import { leadGenerationService } from '@/lib/lead-generation-service';
import AdvancedLeadSearchForm from './AdvancedLeadSearchForm';
import LeadsResults from './LeadsResults';
import GoogleDorkPreview from './GoogleDorkPreview';
import { useToast } from '@/hooks/use-toast';

const LeadGeneratorApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'results'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LeadGenerationResult | null>(null);
  const [showDorkPreview, setShowDorkPreview] = useState(false);
  const [dorkPreview, setDorkPreview] = useState('');
  const { toast } = useToast();

  const [searchCriteria, setSearchCriteria] = useState<LeadSearchCriteria>({
    industry: [],
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    companySize: '',
    jobTitle: '',
    keywords: [],
    field: '',
    customTags: [],
    emailRequired: true,
    phoneRequired: true,
    searchDepth: 3
  });

  const handleCriteriaChange = (criteria: LeadSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const handlePreviewDork = () => {
    try {
      const preview = leadGenerationService.generateGoogleDorkPreview(searchCriteria);
      setDorkPreview(preview);
      setShowDorkPreview(true);
    } catch (error) {
      toast({
        title: "Preview Error",
        description: "Unable to generate Google Dork preview. Please check your search criteria.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (searchCriteria.industry.length === 0 && !searchCriteria.location.city && !searchCriteria.jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least one search criteria (Industry, Location, or Job Title).",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      toast({
        title: "Starting Advanced Search",
        description: `Crawling pages 1-${searchCriteria.searchDepth} with AI-powered extraction...`,
      });

      const searchResults = await leadGenerationService.generateLeads(searchCriteria);
      setResults(searchResults);
      setCurrentStep('results');
      
      toast({
        title: "Smart Leads Generated!",
        description: `Found ${searchResults.totalCount} qualified leads with contact information.`,
      });
    } catch (error) {
      console.error('Error generating leads:', error);
      toast({
        title: "Search Failed",
        description: "Failed to generate leads. Please check your API configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBackToSearch = () => {
    setCurrentStep('search');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-6xl"
      >
        {currentStep === 'search' ? (
          <AdvancedLeadSearchForm
            searchCriteria={searchCriteria}
            onCriteriaChange={handleCriteriaChange}
            onSearch={handleSearch}
            onPreviewDork={handlePreviewDork}
            isSearching={isSearching}
          />
        ) : (
          results && (
            <LeadsResults
              results={results}
              onBackToSearch={handleBackToSearch}
            />
          )
        )}

        {showDorkPreview && (
          <GoogleDorkPreview
            dorkPreview={dorkPreview}
            onClose={() => setShowDorkPreview(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default LeadGeneratorApp;
