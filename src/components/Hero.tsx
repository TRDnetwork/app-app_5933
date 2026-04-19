import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section 
      className="py-32 px-4 sm:px-6 text-center min-h-screen flex items-center justify-center" 
      id="home"
      role="region"
      aria-labelledby="hero-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-green-darker mb-6 leading-tight"
          aria-label="Alex Chen, Full-Stack Developer"
        >
          <span className="block">Alex Chen</span>
          <span className="text-orange text-2xl sm:text-3xl md:text-4xl font-normal mt-2 block">Full-Stack Developer</span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-green-dim max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Building performant, accessible web applications with modern React and Node.js. Passionate about clean code, user experience, and scalable architecture.
        </motion.p>
        <motion.div 
          className="mt-10 sm:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a 
            href="#projects" 
            className="inline-block btn btn-primary text-white hover:bg-orange/90 px-8 py-4 text-base sm:text-lg"
            aria-label="View featured projects"
          >
            View My Work
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;