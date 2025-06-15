
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Target, MapPin, Briefcase, Clock, Globe } from 'lucide-react';
import { LeadSearchCriteria } from '@/lib/lead-types';

interface SimplifiedLeadSearchFormProps {
  searchCriteria: LeadSearchCriteria;
  onCriteriaChange: (criteria: LeadSearchCriteria) => void;
  onSearch: () => void;
  onPreviewDork: () => void;
  isSearching: boolean;
}

const SimplifiedLeadSearchForm: React.FC<SimplifiedLeadSearchFormProps> = ({
  searchCriteria,
  onCriteriaChange,
  onSearch,
  onPreviewDork,
  isSearching
}) => {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Real Estate',
    'Manufacturing', 'Retail', 'Consulting', 'Digital Marketing', 'E-commerce',
    'EdTech', 'FinTech', 'Cybersecurity', 'AI/ML', 'SaaS'
  ];

  const timeRanges = [
    { value: 'h', label: '1 Hour' },
    { value: 'h10', label: '10 Hours' },
    { value: 'd', label: '1 Day' },
    { value: 'd3', label: '3 Days' },
    { value: 'w', label: '1 Week' },
    { value: 'm', label: '1 Month' },
    { value: 'y', label: '1 Year' }
  ];

  const handleIndustryChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      industry: [value]
    });
  };

  const handleLocationChange = (field: 'city' | 'state', value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      location: { ...searchCriteria.location, [field]: value }
    });
  };

  const handleJobTitleChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      jobTitle: value
    });
  };

  const handleTimeRangeChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      timeRange: value
    });
  };

  const handleMaxPagesChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      maxPages: parseInt(value)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-black/60 border-white/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-green-400" />
            Smart Lead Generator
          </CardTitle>
          <p className="text-gray-300">
            Find leads from LinkedIn, Reddit, and Twitter using advanced Google dorking
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-2">
            <Label className="text-white text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Target Industry *
            </Label>
            <Select 
              value={searchCriteria.industry[0] || ''} 
              onValueChange={handleIndustryChange}
            >
              <SelectTrigger className="bg-black/40 border-white/30 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/30">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="text-white hover:bg-white/10">
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="text-white text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">City *</Label>
                <Input
                  value={searchCriteria.location.city || ''}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  placeholder="e.g., New York, Mumbai, London"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">State/Region</Label>
                <Input
                  value={searchCriteria.location.state || ''}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  placeholder="e.g., California, Maharashtra"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label className="text-white text-lg">Target Role</Label>
            <Input
              value={searchCriteria.jobTitle}
              onChange={(e) => handleJobTitleChange(e.target.value)}
              placeholder="e.g., Software Engineer, Marketing Manager, CEO"
              className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Time Range and Search Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Range
              </Label>
              <Select 
                value={searchCriteria.timeRange || ''} 
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value} className="text-white hover:bg-white/10">
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Search Pages
              </Label>
              <Select 
                value={searchCriteria.maxPages?.toString() || '3'} 
                onValueChange={handleMaxPagesChange}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select pages" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  <SelectItem value="1" className="text-white hover:bg-white/10">1 Page</SelectItem>
                  <SelectItem value="2" className="text-white hover:bg-white/10">2 Pages</SelectItem>
                  <SelectItem value="3" className="text-white hover:bg-white/10">3 Pages</SelectItem>
                  <SelectItem value="5" className="text-white hover:bg-white/10">5 Pages</SelectItem>
                  <SelectItem value="10" className="text-white hover:bg-white/10">10 Pages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-400 font-medium mb-2">🎯 Target Platforms</h3>
            <div className="flex gap-4 text-sm text-gray-300">
              <span>✅ LinkedIn Profiles</span>
              <span>✅ Reddit Posts</span>
              <span>✅ Twitter Profiles</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onPreviewDork}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Preview Search
            </Button>
            <Button
              onClick={onSearch}
              disabled={isSearching || (!searchCriteria.industry.length && !searchCriteria.location.city)}
              className="flex-1 bg-white hover:bg-gray-100 text-black font-medium py-3 text-lg"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Finding Leads...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Find Leads
                </>
              )}
            </Button>
          </div>

          {(!searchCriteria.industry.length && !searchCriteria.location.city) && (
            <p className="text-yellow-400 text-sm text-center">
              Please select at least an industry or location to start finding leads
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SimplifiedLeadSearchForm;
