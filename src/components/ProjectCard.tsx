import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    tech: string[];
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg border border-surface shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -8 }}
      aria-labelledby={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h3 
        id={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-xl font-semibold mb-3 text-dark-green font-display"
      >
        {project.title}
      </h3>
      <p className="text-text-dim mb-4 font-body">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span 
            key={tech} 
            className="px-3 py-1 text-sm bg-surface text-text rounded-full"
            aria-label={`Technology: ${tech}`}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
---