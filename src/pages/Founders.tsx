
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const Founders = () => {
  const founders = [
    {
      name: 'Balkrishna Garg',
      role: 'Founder & CEO',
      description: 'Certified Ethical Hacker with expertise in Linux, Arch, Offensive & Defensive Security',
      skills: ['Ethical Hacking', 'Linux', 'Arch Linux', 'Cybersecurity', 'Penetration Testing'],
      avatar: '👨‍💻',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Sanskar Dubey',
      role: 'Founder & Director',
      description: 'MediaWiki Contributor, MERN Stack Developer, and AI Engineer with innovative solutions',
      skills: ['MERN Stack', 'AI Engineering', 'MediaWiki', 'Full-Stack Development', 'Machine Learning'],
      avatar: '👨‍🔬',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Mohd Zaid Sayyed',
      role: 'Co-founder & MD',
      description: 'GDG Prayagraj Ambassador, Hackathon Winner, Flutter/Dart Developer',
      skills: ['Flutter', 'Dart', 'Mobile Development', 'GDG Ambassador', 'Hackathon Winner'],
      avatar: '👨‍🚀',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Shiva Pandey',
      role: 'COO',
      description: 'Next.js expert, Python specialist in Gen AI/ML/DL, and Hackathon Winner',
      skills: ['Next.js', 'Python', 'AI/ML/DL', 'Generative AI', 'Full-Stack Development'],
      avatar: '👨‍💼',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Devendra Singh',
      role: 'CTO',
      description: 'Full-Stack Developer, Python & ML Enthusiast, GSSoC\'24 Contributor',
      skills: ['Full-Stack', 'Python', 'Machine Learning', 'Open Source', 'GSSoC Contributor'],
      avatar: '👨‍🔧',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Adarsh Shukla',
      role: 'CMO',
      description: 'Data Analytics expert, Data Visualization specialist, Microsoft Products Expert',
      skills: ['Data Analytics', 'Data Visualization', 'Microsoft Products', 'Business Intelligence', 'Marketing'],
      avatar: '👨‍📊',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
  ];

  return (
    <Layout>
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Meet Our Founders
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The innovative minds behind CodeResite - passionate technologists driving the future of digital solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="text-6xl mb-4">{founder.avatar}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{founder.name}</h3>
                    <p className="text-green-400 font-medium mb-4">{founder.role}</p>
                    <p className="text-gray-300 text-sm mb-6 flex-grow">{founder.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {founder.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <motion.a
                        href={founder.social.linkedin}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        💼
                      </motion.a>
                      <motion.a
                        href={founder.social.github}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        🐙
                      </motion.a>
                      <motion.a
                        href={founder.social.twitter}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        🐦
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black mr-4"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => document.getElementById('featured-tools')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-500 hover:bg-green-600 text-black font-medium"
              >
                View All Tools
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Founders;
