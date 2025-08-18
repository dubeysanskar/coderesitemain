
import React from 'react';
import Layout from '@/components/Layout';
import MailMergerApp from '@/components/mail-merger/MailMergerApp';

const MailMerger = () => {
  return (
    <Layout
      seoProps={{
        title: "Mail Merger — Personalized Bulk Emailing | CodeResite",
        description: "Send personalized bulk emails from CSVs with dynamic fields, scheduling and tracking via CodeResite's Mail Merger.",
        canonical: "https://coderesite.com/mail-merger",
        keywords: ["mail merge", "bulk email", "email marketing", "personalized emails", "CSV email"]
      }}
    >
      <MailMergerApp />
    </Layout>
  );
};

export default MailMerger;
