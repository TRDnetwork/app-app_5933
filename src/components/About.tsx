import { motion } from 'framer-motion';

const About = () => {
  return (
    <section
      id="about"
      className="py-24 px-6 bg-[#e9e5dd] safe-area-inset-bottom"
      aria-labelledby="about-heading"
      role="region"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="about-heading" className="text-3xl md:text-4xl font-display font-semibold text-[#1a2e1a] mb-8 text-center">
            About Me
          </h2>
          <p className="text-lg text-[#7a7060] font-satoshi leading-relaxed max-w-3xl mx-auto">
            I'm a passionate full-stack developer with over 5 years of experience building scalable web applications. 
            I specialize in React, Node.js, and cloud-native architectures. When I'm not coding, you can find me hiking, 
            contributing to open-source projects, or mentoring junior developers.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;