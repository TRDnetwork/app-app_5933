import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section
      id="hero"
      className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 text-center safe-area-inset-top"
      aria-labelledby="hero-heading"
      role="region"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        aria-hidden="true"
      >
        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[#1a2e1a] leading-tight mb-4">
          Alex Morgan
        </h1>
        <p className="text-xl md:text-2xl text-[#7a7060] font-satoshi max-w-3xl mx-auto" aria-label="Professional role">
          Full-Stack Developer & Open Source Contributor
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;