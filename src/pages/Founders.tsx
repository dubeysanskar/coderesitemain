
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Founders = () => {
  const navigate = useNavigate();

  const founders = [
    {
      name: 'Balkrishna Garg',
      role: 'Founder & CEO',
      description: 'Certified Ethical Hacker with expertise in Linux, Arch, Offensive & Defensive Security',
      skills: ['Ethical Hacking', 'Linux', 'Arch Linux', 'Cybersecurity', 'Penetration Testing'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
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
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
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
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
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
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
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
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
  ];

  const scrollToSection = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
                className="group"
              >
                <Card className="bg-gradient-to-br from-black/60 to-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full overflow-hidden relative">
                  <CardContent className="p-0 text-center h-full flex flex-col relative">
                    {/* Circular container with image */}
                    <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
                      <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-green-400/50 group-hover:border-green-400 transition-all duration-300">
                        <img 
                          src={founder.avatar} 
                          alt={founder.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Overlay on hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 rounded-t-lg"
                      >
                        <div className="flex justify-center space-x-4 mb-4">
                          <motion.a
                            href={founder.social.linkedin}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-green-400 transition-colors text-2xl"
                          >
                            💼
                          </motion.a>
                          <motion.a
                            href={founder.social.github}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-green-400 transition-colors text-2xl"
                          >
                            🐙
                          </motion.a>
                          <motion.a
                            href={founder.social.twitter}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-green-400 transition-colors text-2xl"
                          >
                            🐦
                          </motion.a>
                        </div>
                        <p className="text-gray-200 text-sm text-center">{founder.description}</p>
                      </motion.div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{founder.name}</h3>
                        <p className="text-green-400 font-medium mb-4">{founder.role}</p>
                        
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
                      </div>
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
                onClick={() => navigate('/')}
                className="bg-green-500 hover:bg-green-600 text-black font-medium mr-4 hover:scale-105 transition-all duration-200"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => scrollToSection('featured-tools')}
                variant="outline"
                className="border-white text-white bg-black hover:bg-white hover:text-black hover:scale-105 transition-all duration-200"
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
