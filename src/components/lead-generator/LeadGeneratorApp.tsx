
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadSearchCriteria, LeadGenerationResult } from '@/lib/lead-types';
import { leadGenerationService } from '@/lib/lead-generation-service';
import LeadSearchForm from './LeadSearchForm';
import LeadsResults from './LeadsResults';
import { useToast } from '@/hooks/use-toast';

const LeadGeneratorApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'results'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LeadGenerationResult | null>(null);
  const { toast } = useToast();

  const [searchCriteria, setSearchCriteria] = useState<LeadSearchCriteria>({
    industry: '',
    location: '',
    companySize: '',
    jobTitle: '',
    keywords: '',
    emailRequired: false,
    phoneRequired: false
  });

  const handleCriteriaChange = (field: keyof LeadSearchCriteria, value: string | boolean) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!searchCriteria.industry && !searchCriteria.location && !searchCriteria.jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least one search criteria (Industry, Location, or Job Title).",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await leadGenerationService.generateLeads(searchCriteria);
      setResults(searchResults);
      setCurrentStep('results');
      toast({
        title: "Leads Generated Successfully!",
        description: `Found ${searchResults.totalCount} potential leads matching your criteria.`,
      });
    } catch (error) {
      console.error('Error generating leads:', error);
      toast({
        title: "Search Failed",
        description: "Failed to generate leads. Please try again.",
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
          <LeadSearchForm
            searchCriteria={searchCriteria}
            onCriteriaChange={handleCriteriaChange}
            onSearch={handleSearch}
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
      </motion.div>
    </div>
  );
};

export default LeadGeneratorApp;
