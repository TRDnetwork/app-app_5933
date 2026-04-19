import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'TaskFlow',
    description: 'A collaborative task management platform with real-time updates and team analytics.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO'],
  },
  {
    title: 'DataViz Studio',
    description: 'Interactive dashboard builder for business intelligence with drag-and-drop components.',
    tech: ['Vue', 'D3.js', 'Python', 'FastAPI', 'Redis'],
  },
  {
    title: 'AuthGuard',
    description: 'Secure authentication microservice with JWT, OAuth2, and rate limiting protection.',
    tech: ['Next.js', 'Go', 'MongoDB', 'JWT', 'Docker'],
  },
];

export const Projects: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-24 px-6"
      id="projects"
      role="region"
      aria-labelledby="projects-title"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          id="projects-title"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl sm:text-4xl font-semibold mb-12 text-center"
          style={{ color: '#1a2e1a', fontFamily: 'Fraunces, serif' }}
        >
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              role="article"
              aria-label={`Project: ${project.title}`}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
---