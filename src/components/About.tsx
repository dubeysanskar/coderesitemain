
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { SplineScene } from './ui/splite';
import { Spotlight } from './ui/spotlight';

const About = () => {
  const values = [
    {
      icon: '💡',
      title: 'Innovation First',
      description: 'We embrace the latest tech and cutting-edge solutions.',
    },
    {
      icon: '🎯',
      title: 'Client-Centric',
      description: 'Your goals drive our development process.',
    },
    {
      icon: '⚡',
      title: 'Quality Code',
      description: 'We adhere to best coding practices and standards.',
    },
    {
      icon: '🚀',
      title: 'Fast Delivery',
      description: 'Timely results without compromising on quality.',
    },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              About CodeResite
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              We are a team of passionate developers, designers, and innovators committed to creating 
              exceptional experiences and digital solutions. Our mission is to drive innovation forward 
              using cutting-edge technologies and creative problem-solving. We empower users with practical 
              tools that simplify complex tasks — from intelligent automation and AI-powered platforms to 
              educational utilities and scalable services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/30 border-white/10 hover:border-green-400/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">{value.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                      <p className="text-gray-400 text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Robot UI - 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="w-full h-96 bg-black/[0.96] relative overflow-hidden border border-white/10">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              
              <div className="flex h-full">
                {/* Left content */}
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Interactive 3D
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
                    that capture attention and enhance your design.
                  </p>
                </div>

                {/* Right content - 3D Scene */}
                <div className="flex-1 relative">
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              {/* Fallback for when Spline doesn't load */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="text-6xl mb-4 opacity-20"
                    >
                      🤖
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
