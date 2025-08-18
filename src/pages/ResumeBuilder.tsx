
import React from 'react';
import Layout from '@/components/Layout';
import { ResumeBuilderApp } from '@/components/resume-builder/ResumeBuilderApp';

const ResumeBuilder = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://coderesite.com/resume-builder" },
    "headline": "Resume Builder — ATS-ready Resumes",
    "description": "Build ATS-friendly resumes quickly. Import LinkedIn, choose templates and download polished CVs from CodeResite.",
    "image": ["https://coderesite.com/assets/images/og-resume.jpg"],
    "author": { "@type": "Person", "name": "Sanskar Dubey", "url": "https://coderesite.com/about/" },
    "publisher": { "@type": "Organization", "name": "CodeResite", "logo": { "@type": "ImageObject", "url": "https://coderesite.com/assets/images/logo.png" } },
    "datePublished": "2025-08-18",
    "dateModified": "2025-08-18"
  };

  return (
    <Layout
      seoProps={{
        title: "Resume Builder — ATS-ready Resumes | CodeResite",
        description: "Build ATS-friendly resumes quickly. Import LinkedIn, choose templates and download polished CVs from CodeResite.",
        canonical: "https://coderesite.com/resume-builder",
        keywords: ["resume builder", "CV maker", "ATS resume", "job application", "career tools"],
        jsonLd
      }}
    >
      <div className="min-h-screen bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 animated-gradient">
              AI Resume Builder
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create ATS-optimized resumes tailored to specific job descriptions using AI
            </p>
          </div>
          <ResumeBuilderApp />
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
