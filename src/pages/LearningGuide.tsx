
import React from 'react';
import Layout from '@/components/Layout';
import { LearningGuideApp } from '@/components/learning-guide/LearningGuideApp';

const LearningGuide = () => {
  return (
    <Layout
      seoProps={{
        title: "Learning Guide — Roadmaps & Tutorials | CodeResite",
        description: "Structured learning paths for AI, web development and cybersecurity — projects, reading lists and practice tasks.",
        canonical: "https://coderesite.com/learning-guide",
        keywords: ["learning roadmap", "programming tutorials", "web development guide", "AI learning path", "cybersecurity training"]
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <LearningGuideApp />
      </div>
    </Layout>
  );
};

export default LearningGuide;
