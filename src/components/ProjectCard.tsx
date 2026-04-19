import { motion } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  tech: string[];
}

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div 
      className="card bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-md min-h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      role="article"
      aria-labelledby={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h3 
        id={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-xl font-bold mb-3 text-[#1a2e1a]"
      >
        {project.title}
      </h3>
      <p className="text-[#4a4a4a] mb-4 leading-relaxed">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-sm bg-[#e9e5dd] text-[#1a2e1a] rounded-full min-h-8 min-w-8 flex items-center justify-center"
            aria-label={`Technology: ${tech}`}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
---