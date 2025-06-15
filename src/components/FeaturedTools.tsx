import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const FeaturedTools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'PPT Generator',
      description: 'Generate professional PowerPoint presentations quickly.',
      icon: '📊',
      link: '/ppt-generator',
      slug: 'ppt-generator',
    },
    {
      title: 'Resume Builder',
      description: 'Create a standout resume with our easy-to-use builder.',
      icon: '📝',
      link: '/resume-builder',
      slug: 'resume-builder',
    },
    {
      title: 'Report Generator',
      description: 'Generate detailed reports effortlessly.',
      icon: '📈',
      link: '/report-generator',
      slug: 'report-generator',
    },
    {
      title: 'Lead Generator',
      description: 'Find and connect with potential leads.',
      icon: '🎯',
      link: '/lead-generator',
      slug: 'lead-generator',
    },
    {
      title: 'Mail Merger',
      description: 'Personalize and send bulk emails efficiently.',
      icon: '✉️',
      link: '/mail-merger',
      slug: 'mail-merger',
    },
    {
      title: 'Prompt Guide',
      description: 'Get the best prompts for AI tools.',
      icon: '💡',
      link: '/prompt-guide',
      slug: 'prompt-guide',
    },
  ];

  return (
    <section id="featured-tools" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Featured Tools
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our most popular tools designed to boost your productivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.slug}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="h-full"
              >
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="text-5xl mb-4 text-center">{tool.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center">{tool.title}</h3>
                    <p className="text-gray-300 text-sm mb-6 flex-grow">{tool.description}</p>
                    
                    <SignedIn>
                      {/* Try Now enabled */}
                      <Button onClick={() => navigate(tool.link)}>
                        Try Now
                      </Button>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button>
                          Try Now
                        </Button>
                      </SignInButton>
                    </SignedOut>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;
