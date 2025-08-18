
import React from 'react';
import Layout from '@/components/Layout';
import PromptGuideApp from '@/components/prompt-guide/PromptGuideApp';

const PromptGuide = () => {
  return (
    <Layout
      seoProps={{
        title: "Prompt Guide — Prompt Engineering Patterns | CodeResite",
        description: "Prompt templates and patterns that get better outputs from AI tools. Guides, examples and best practices.",
        canonical: "https://coderesite.com/prompt-guide",
        keywords: ["prompt engineering", "AI prompts", "prompt templates", "prompt patterns", "AI optimization"]
      }}
    >
      <PromptGuideApp />
    </Layout>
  );
};

export default PromptGuide;
