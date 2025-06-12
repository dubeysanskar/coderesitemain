
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedTools from '@/components/FeaturedTools';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <FeaturedTools />
      <Services />
      <Pricing />
      <Contact />
    </Layout>
  );
};

export default Index;
