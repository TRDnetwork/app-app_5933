import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section 
      id="home" 
      className="section min-h-screen flex items-center justify-center text-center px-6 pt-safe pb-safe"
      role="region" 
      aria-label="Hero section featuring developer introduction"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-text leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          aria-label="Jane Doe, Full-Stack Developer & UI Enthusiast"
        >
          <span className="block">Jane Doe</span>
          <span className="text-accent text-2xl sm:text-3xl md:text-4xl font-normal mt-2 block">
            Full-Stack Developer & UI Enthusiast
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-text-dim mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Building seamless digital experiences with modern web technologies and thoughtful design.
        </motion.p>
        
        <motion.a
          href="#contact"
          className="btn bg-accent text-white px-8 py-4 rounded-lg font-semibold inline-block transition-all duration-300 hover:bg-accent-alt focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 min-h-12 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          role="button"
          tabIndex={0}
          aria-label="Contact Me"
        >
          Contact Me
        </motion.a>
      </div>
    </section>
  );
};
---