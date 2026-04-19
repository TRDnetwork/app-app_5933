import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'TaskFlow',
    description: 'A collaborative task management platform with real-time updates and team messaging.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO'],
  },
  {
    title: 'DataViz Studio',
    description: 'Interactive dashboard builder for business analytics with drag-and-drop components.',
    tech: ['Vue', 'D3.js', 'Python', 'FastAPI', 'Redis'],
  },
  {
    title: 'AuthGuard',
    description: 'Secure authentication microservice with JWT, OAuth, and rate limiting.',
    tech: ['Next.js', 'Go', 'MongoDB', 'JWT', 'Docker'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4 md:px-6" role="region" aria-labelledby="projects-heading">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          id="projects-heading"
          className="text-3xl md:text-4xl font-display font-semibold text-green-darker mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project, index) => (
            <motion.div key={project.title} variants={item}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;