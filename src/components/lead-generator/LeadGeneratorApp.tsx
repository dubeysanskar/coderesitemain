
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadSearchCriteria, LeadGenerationResult } from '@/lib/lead-types';
import { newLeadGenerationService } from '@/lib/new-lead-generation-service';
import SimplifiedLeadSearchForm from './SimplifiedLeadSearchForm';
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
      country: 'United States'
    },
    companySize: '',
    jobTitle: '',
    keywords: [],
    field: '',
    customTags: [],
    emailRequired: true,
    phoneRequired: false,
    searchDepth: 3
  });

  const handleCriteriaChange = (criteria: LeadSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const handlePreviewDork = () => {
    try {
      const preview = newLeadGenerationService.generateDorkPreview(searchCriteria);
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
    if (searchCriteria.industry.length === 0 && !searchCriteria.location.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least one search criteria (Industry or Location).",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      toast({
        title: "🚀 Multi-Platform Lead Search Started",
        description: "Searching LinkedIn, Reddit, and Twitter for qualified leads...",
      });

      const searchResults = await newLeadGenerationService.generateLeads(searchCriteria);
      setResults(searchResults);
      setCurrentStep('results');
      
      toast({
        title: "🎯 Leads Found!",
        description: `Found ${searchResults.totalCount} qualified leads across multiple platforms.`,
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
        className="container mx-auto max-w-4xl"
      >
        {currentStep === 'search' ? (
          <SimplifiedLeadSearchForm
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
