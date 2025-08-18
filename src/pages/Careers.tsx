import React from 'react';
import Layout from '@/components/Layout';
import CareerHero from '@/components/careers/CareerHero';
import CareerForm from '@/components/careers/CareerForm';

const Careers = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <CareerHero />
        <CareerForm />
      </div>
    </Layout>
  );
};

export default Careers;