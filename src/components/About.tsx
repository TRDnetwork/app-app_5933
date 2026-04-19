import { motion } from 'framer-motion';

export const About = () => {
  return (
    <section 
      id="about" 
      className="section py-20 px-6"
      role="region" 
      aria-labelledby="about-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 
          id="about-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-text-dim leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          I'm a full-stack developer with over 5 years of experience creating robust web applications. 
          My passion lies in building intuitive user interfaces backed by scalable and secure architectures. 
          When I'm not coding, you can find me exploring new design systems or contributing to open-source projects.
        </motion.p>
      </div>
    </section>
  );
};