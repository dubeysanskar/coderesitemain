
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Founders = () => {
  const [hoveredFounder, setHoveredFounder] = useState<number | null>(null);

  const founders = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Visionary leader with 10+ years in AI and machine learning. Former CTO at TechCorp.',
      socials: {
        linkedin: 'https://linkedin.com/in/alexjohnson',
        twitter: 'https://twitter.com/alexjohnson',
        github: 'https://github.com/alexjohnson',
        email: 'alex@coderesite.com'
      }
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack engineer and AI researcher. PhD in Computer Science from Stanford.',
      socials: {
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/sarahchen',
        github: 'https://github.com/sarahchen',
        email: 'sarah@coderesite.com'
      }
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Creative director with expertise in UX/UI design and brand strategy.',
      socials: {
        linkedin: 'https://linkedin.com/in/michaelrodriguez',
        twitter: 'https://twitter.com/michaelrodriguez',
        github: 'https://github.com/michaelrodriguez',
        email: 'michael@coderesite.com'
      }
    }
  ];

  return (
    <Layout>
      <style>{`
        .blob-container {
          position: relative;
          width: 300px;
          height: 300px;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(45deg, #00ff88, #00ccff);
          padding: 8px;
        }
        
        .blob-container:hover {
          border-radius: 50% 60% 70% 30% / 40% 60% 30% 70%;
          transform: scale(1.05);
        }
        
        .blob-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 55% 45% 35% 65% / 55% 35% 65% 45%;
          transition: all 0.3s ease;
        }
        
        .blob-container:hover .blob-image {
          filter: blur(4px);
          border-radius: 45% 55% 65% 35% / 45% 65% 35% 55%;
        }
        
        .founder-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: all 0.3s ease;
          border-radius: 55% 45% 35% 65% / 55% 35% 65% 45%;
          padding: 20px;
          text-align: center;
        }
        
        .blob-container:hover .founder-overlay {
          opacity: 1;
          border-radius: 45% 55% 65% 35% / 45% 65% 35% 55%;
        }
      `}</style>
      
      <section className="py-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Meet Our Founders
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The visionary minds behind CodeResite, driving innovation in AI-powered solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex flex-col items-center"
                onMouseEnter={() => setHoveredFounder(founder.id)}
                onMouseLeave={() => setHoveredFounder(null)}
              >
                <div className="blob-container">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="blob-image"
                  />
                  
                  <div className="founder-overlay">
                    <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
                    <p className="text-green-400 text-lg mb-4">{founder.role}</p>
                    
                    <div className="flex gap-4">
                      <motion.a
                        href={founder.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        <Linkedin size={24} />
                      </motion.a>
                      <motion.a
                        href={founder.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        <Twitter size={24} />
                      </motion.a>
                      <motion.a
                        href={founder.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        <Github size={24} />
                      </motion.a>
                      <motion.a
                        href={`mailto:${founder.socials.email}`}
                        whileHover={{ scale: 1.2 }}
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        <Mail size={24} />
                      </motion.a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center max-w-sm">
                  <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
                  <p className="text-green-400 text-lg mb-3">{founder.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{founder.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Founders;
