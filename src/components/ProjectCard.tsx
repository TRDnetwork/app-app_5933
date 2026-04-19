import { motion } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  tech: string[];
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div 
      className="card bg-white p-6 rounded-lg shadow-md border border-surface hover-lift transition-all duration-300 min-h-44"
      role="article"
      aria-labelledby={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Handle card interaction if needed
        }
      }}
    >
      <h3 
        id={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-xl font-bold mb-3 text-text"
      >
        {project.title}
      </h3>
      
      <p className="text-text-dim mb-4 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-surface text-text text-sm rounded-full min-h-8 min-w-8 flex items-center justify-center"
            role="badge"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
---