
import React from 'react';
import Layout from '@/components/Layout';
import { AppBuilder } from '@/components/ppt-generator/AppBuilder';

const PPTGenerator = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://coderesite.com/ppt-generator" },
    "headline": "PPT Generator — Create Presentations Automatically",
    "description": "Generate slide decks from outlines and export .pptx with speaker notes using CodeResite's PPT Generator.",
    "image": ["https://coderesite.com/assets/images/og-ppt.jpg"],
    "author": { "@type": "Person", "name": "Sanskar Dubey", "url": "https://coderesite.com/about/" },
    "publisher": { "@type": "Organization", "name": "CodeResite", "logo": { "@type": "ImageObject", "url": "https://coderesite.com/assets/images/logo.png" } },
    "datePublished": "2025-08-18",
    "dateModified": "2025-08-18"
  };

  return (
    <Layout
      seoProps={{
        title: "PPT Generator — Create Presentations Automatically | CodeResite",
        description: "Generate professional slide decks from outlines or prompts and export .pptx with speaker notes using CodeResite's PPT Generator.",
        canonical: "https://coderesite.com/ppt-generator",
        keywords: ["PPT generator", "presentation maker", "slide generator", "PowerPoint creator", "AI presentation"],
        jsonLd
      }}
    >
      <div className="pt-16">
        <AppBuilder />
      </div>
    </Layout>
  );
};

export default PPTGenerator;
