
import React from 'react';
import Layout from '@/components/Layout';
import { WebsiteBuilderApp } from '@/components/website-builder/WebsiteBuilderApp';

const WebsiteBuilder = () => {
  return (
    <Layout
      seoProps={{
        title: "Website Builder — Fast Static Sites & Templates | CodeResite",
        description: "Build lightweight websites quickly with templates, a simple editor and one-click deploy via CodeResite Website Builder.",
        canonical: "https://coderesite.com/website-builder",
        keywords: ["website builder", "static site generator", "web templates", "quick website", "drag drop builder"]
      }}
    >
      <div className="pt-16">
        <WebsiteBuilderApp />
      </div>
    </Layout>
  );
};

export default WebsiteBuilder;
