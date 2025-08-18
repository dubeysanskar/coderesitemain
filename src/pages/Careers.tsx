import React from 'react';
import Layout from '@/components/Layout';
import CareerHero from '@/components/careers/CareerHero';
import CareerForm from '@/components/careers/CareerForm';

const Careers = () => {
  return (
    <Layout
      seoProps={{
        title: "Careers at CodeResite",
        description: "Open roles, internships and how we hire at CodeResite. Join the team building developer tools and tutorials.",
        canonical: "https://coderesite.com/careers",
        keywords: ["careers", "jobs", "internships", "hiring", "CodeResite team"]
      }}
    >
      <div className="min-h-screen">
        <CareerHero />
        <CareerForm />
      </div>
    </Layout>
  );
};

export default Careers;