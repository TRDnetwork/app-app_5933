import { motion } from 'framer-motion';

export const About = () => {
  return (
    <section 
      id="about" 
      className="section py-20 px-4"
      aria-labelledby="about-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="about-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-[#1a2e1a]"
          >
            About Me
          </h2>
          <div className="divider mx-auto mb-8" /> {/* a11y fix: visual divider with sufficient contrast */}
          <p className="text-lg text-[#4a4a4a] leading-relaxed">
            I'm a full-stack developer with over 5 years of experience building scalable web applications. 
            I specialize in React, Node.js, and cloud architecture, with a strong focus on creating intuitive 
            user experiences and robust backend systems. When I'm not coding, you can find me hiking or 
            experimenting with new recipes in the kitchen.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
---