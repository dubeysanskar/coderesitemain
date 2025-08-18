
import React from 'react';
import Layout from '@/components/Layout';
import LeadGeneratorApp from '@/components/lead-generator/LeadGeneratorApp';

const LeadGenerator = () => {
  return (
    <Layout
      seoProps={{
        title: "Lead Generator — Build Prospect Lists Quickly | CodeResite",
        description: "Generate targeted prospect lists, validate emails and export CSVs for outreach with CodeResite's Lead Generator.",
        canonical: "https://coderesite.com/lead-generator",
        keywords: ["lead generator", "prospect finder", "email finder", "sales leads", "lead generation tools"]
      }}
    >
      <LeadGeneratorApp />
    </Layout>
  );
};

export default LeadGenerator;
