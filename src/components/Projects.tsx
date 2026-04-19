import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects: Array<{
  title: string;
  description: string;
  tech: string[];
}> = [
  {
    title: 'TaskFlow',
    description: 'A task management app with real-time collaboration',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'DataViz Studio',
    description: 'Interactive data visualization platform for business analytics',
    tech: ['D3.js', 'Node.js', 'MongoDB'],
  },
  {
    title: 'AuthGuard',
    description: 'Authentication system with OAuth and JWT token management',
    tech: ['Next.js', 'Auth0', 'PostgreSQL'],
  },
];

export const Projects = () => {
  return (
    <section 
      id="projects" 
      className="section py-20 px-6"
      role="region" 
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          id="projects-heading"
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
---