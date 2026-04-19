import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section 
      id="home" 
      className="section min-h-screen flex items-center justify-center px-4"
      aria-labelledby="hero-heading"
    >
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#1a2e1a]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Jane Doe
        </motion.h1>
        <motion.p 
          className="text-xl sm:text-2xl mb-8 text-[#4a4a4a] font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Full-Stack Developer & UI Enthusiast
        </motion.p>
        <motion.a
          href="#contact"
          className="btn inline-block px-8 py-3 bg-[#e66000] text-white rounded-lg font-medium transition-all duration-300 hover:bg-[#ff8c42] focus:outline-none focus:ring-4 focus:ring-[#e66000]/50 min-h-11"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          aria-label="Contact Me"
        >
          Contact Me
        </motion.a>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-[#1a2e1a]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
---