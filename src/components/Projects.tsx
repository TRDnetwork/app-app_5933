import { motion } from 'framer-motion';

export const Projects = () => {
  const projects = [
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
      description: 'Authentication system with JWT and OAuth integration',
      tech: ['Express', 'React', 'PostgreSQL'],
    },
  ];

  return (
    <section 
      id="projects" 
      className="section py-20"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="projects-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-[#1a2e1a]"
          >
            Featured Projects
          </h2>
          <div className="divider mx-auto mb-8" /> {/* a11y fix: visual divider with sufficient contrast */}
        </motion.div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
---