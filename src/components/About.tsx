import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const About = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              About CodeResite
            </h2>
            <p className="text-xl text-gray-300">
              We are a team of passionate developers and AI enthusiasts dedicated to providing innovative solutions for your digital needs.
            </p>
            <p className="text-gray-300">
              Our mission is to empower businesses and individuals with cutting-edge technology that drives growth and efficiency.
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-full w-full md:w-auto hover:scale-105 transition-all duration-200">
              Learn More
            </Button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
              <CardContent className="p-0">
                <img
                  src="/about-image.png"
                  alt="About Us"
                  className="w-full h-full object-cover rounded-md"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
