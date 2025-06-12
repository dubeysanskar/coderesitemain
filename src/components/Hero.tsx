
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = ['AI Solutions', 'Web Services', 'App Development', 'Cybersecurity'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredTools = [
    {
      title: 'PPT Generator',
      description: 'Create stunning presentations with AI',
      icon: '📊',
    },
    {
      title: 'Report Generator',
      description: 'Generate comprehensive reports instantly',
      icon: '📋',
    },
    {
      title: 'AI Image Creator',
      description: 'Create professional images with AI',
      icon: '🎨',
    },
  ];

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative px-4 pt-16">
      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          We Drive Innovation Forward
        </h1>
        
        {/* Animated Subtext */}
        <div className="text-xl md:text-2xl lg:text-3xl text-green-400 font-medium h-12 flex items-center justify-center">
          <motion.span
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {texts[currentText]}
          </motion.span>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-12"
      >
        <Button 
          onClick={() => scrollToSection('featured-tools')}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full text-lg"
        >
          Try Free Tools
        </Button>
        <Button 
          onClick={() => scrollToSection('services')}
          variant="outline"
          size="lg"
          className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full text-lg"
        >
          Explore Services
        </Button>
      </motion.div>

      {/* Featured Tools Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl"
      >
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {featuredTools.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className="min-w-[280px] flex-shrink-0"
            >
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{tool.description}</p>
                  <Button 
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-full"
                  >
                    Try It
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
