
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', action: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Our Tools', action: () => document.getElementById('featured-tools')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Our Services', action: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Founders', action: () => window.location.href = '/founders' },
    { label: 'Certificate Validator', action: () => window.location.href = '/validator' },
  ];

  const socialLinks = [
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '💼', label: 'LinkedIn', href: '#' },
    { icon: '🐙', label: 'GitHub', href: '#' },
  ];

  return (
    <footer className="bg-black/80 border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p>contact@coderesite.com</p>
              <p>+91 79920 89454</p>
              <p>India</p>
            </div>
          </motion.div>

          {/* Legal & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Legal & Social</h3>
            <div className="space-y-2">
              <div className="space-y-2">
                <button className="block text-gray-300 hover:text-green-400 transition-colors duration-200">
                  Privacy Policy
                </button>
                <button className="block text-gray-300 hover:text-green-400 transition-colors duration-200">
                  Terms of Service
                </button>
              </div>
              
              <div className="flex space-x-4 pt-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl hover:text-green-400 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm">
              © 2025 CodeResite. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
