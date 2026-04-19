import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export const Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section 
      id="home" 
      className="section min-h-screen flex items-center justify-center text-center px-4 pt-safe pb-safe"
      role="region" 
      aria-label="Hero section featuring developer introduction"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-dark-green font-display tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
          aria-labelledby="hero-title"
        >
          <span id="hero-title">Jane Doe</span>
        </motion.h1>
        <motion.p 
          className="text-xl sm:text-2xl mb-8 text-text-dim font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
          aria-describedby="hero-subtitle"
        >
          <span id="hero-subtitle">Full-Stack Developer & UI Enthusiast</span>
        </motion.p>
        <motion.a
          href="#contact"
          className="btn inline-block px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-alt transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-opacity-50 tap-target"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.6 }}
          role="button"
          tabIndex={0}
          aria-label="Contact me to discuss opportunities"
        >
          Contact Me
        </motion.a>
      </div>
    </section>
  );
};
---