import React from 'react';
import { motion } from 'framer-motion';

const CareerHero = () => {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent"
        >
          Get Hired at coderesite.com
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          We are a coder site, building innovative solutions with passionate people.
          Join our team of developers, creators, and strategists. Pick your role, apply,
          and we'll connect with you for the next steps.
        </motion.p>
      </div>
    </section>
  );
};

export default CareerHero;