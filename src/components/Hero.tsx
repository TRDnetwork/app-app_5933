import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="section text-center py-32"
      style={{ backgroundColor: '#faf8f5' }}
      role="banner"
      aria-label="Hero section featuring Jane Doe, Full-Stack Developer & UI Enthusiast"
    >
      <div className="max-w-3xl mx-auto px-6">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ color: '#1a2e1a', fontFamily: 'Fraunces, serif' }}
          aria-live="polite"
        >
          Jane Doe
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-[#4a4538] mb-8"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          Full-Stack Developer & UI Enthusiast
        </motion.p>
        <motion.a
          href="#contact"
          className="btn inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Contact me - scroll to contact form"
        >
          Contact Me
        </motion.a>
      </div>
    </motion.section>
  );
};
---