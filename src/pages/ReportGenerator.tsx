
import React from 'react';
import Layout from '../components/Layout';
import ReportGeneratorApp from '../components/report-generator/ReportGeneratorApp';

const ReportGenerator = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://coderesite.com/report-generator" },
    "headline": "Report Generator — Automated Reports & PDFs",
    "description": "Create structured reports and export PDFs with charts, templates and easy data import — Report Generator by CodeResite.",
    "image": ["https://coderesite.com/assets/images/og-report.jpg"],
    "author": { "@type": "Person", "name": "Sanskar Dubey", "url": "https://coderesite.com/about/" },
    "publisher": { "@type": "Organization", "name": "CodeResite", "logo": { "@type": "ImageObject", "url": "https://coderesite.com/assets/images/logo.png" } },
    "datePublished": "2025-08-18",
    "dateModified": "2025-08-18"
  };

  return (
    <Layout
      seoProps={{
        title: "Report Generator — Automated Reports & PDFs | CodeResite",
        description: "Create structured reports and export PDFs with charts, templates and easy data import — Report Generator by CodeResite.",
        canonical: "https://coderesite.com/report-generator",
        keywords: ["report generator", "PDF creator", "academic reports", "business reports", "automated reporting"],
        jsonLd
      }}
    >
      <ReportGeneratorApp />
    </Layout>
  );
};

export default ReportGenerator;
