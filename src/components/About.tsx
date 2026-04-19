import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-24 px-6"
      id="about"
      role="region"
      aria-labelledby="about-title"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          id="about-title"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl sm:text-4xl font-semibold mb-8 text-center"
          style={{ color: '#1a2e1a', fontFamily: 'Fraunces, serif' }}
        >
          About Me
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#4a4538] max-w-3xl mx-auto text-center leading-relaxed"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          I'm a passionate full-stack developer with expertise in React, Node.js, and cloud infrastructure. I love building scalable applications with clean, maintainable code and intuitive user experiences.
        </motion.p>
      </div>
    </motion.section>
  );
};
---