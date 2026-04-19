import { motion } from 'framer-motion';

export const About = () => {
  return (
    <section 
      id="about" 
      className="section px-4 py-16 scroll-mt-20"
      role="region" 
      aria-labelledby="about-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 
            id="about-heading" 
            className="text-3xl font-display font-bold mb-8 text-center text-dark-green"
          >
            About Me
          </h2>
          <p className="text-lg text-text-dim font-body max-w-2xl mx-auto leading-relaxed">
            I'm a full-stack developer with over 5 years of experience building scalable web applications and intuitive user interfaces. I specialize in React, Node.js, and modern JavaScript frameworks, with a strong focus on performance and accessibility.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
---