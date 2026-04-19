import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'TaskFlow',
    description: 'A task management app with real-time collaboration',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'DataViz Studio',
    description: 'Interactive data visualization platform with D3.js',
    tech: ['D3.js', 'Node.js', 'MongoDB'],
  },
  {
    title: 'AuthGuard',
    description: 'Authentication system with OAuth and JWT support',
    tech: ['Express', 'React', 'PostgreSQL'],
  },
];

export const Projects = () => {
  return (
    <section 
      id="projects" 
      className="section px-4 py-16 scroll-mt-20"
      role="region" 
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 
            id="projects-heading" 
            className="text-3xl font-display font-bold mb-12 text-center text-dark-green"
          >
            Featured Projects
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="hover-lift"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
---