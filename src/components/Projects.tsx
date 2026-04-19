import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
}

const ProjectCard = ({ title, description, tech }: ProjectCardProps) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-sm border border-[#e9e5dd] hover:shadow-md transition-shadow duration-300"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      role="article"
      aria-labelledby={`project-title-${title.replace(/\s+/g, '-')}`}
      style={{ minHeight: '300px' }}
    >
      <h3 id={`project-title-${title.replace(/\s+/g, '-')}`} className="text-xl font-semibold text-[#1a2e1a] mb-3">
        {title}
      </h3>
      <p className="text-[#7a7060] mb-4 leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2 mt-auto" aria-label={`Technologies used in ${title}`}>
        {tech.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-[#e66000]/10 text-[#e66000] text-xs font-medium rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projectList = [
    {
      title: 'TaskFlow',
      description:
        'A collaborative task management platform with real-time updates and team analytics.',
      tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO'],
    },
    {
      title: 'DataViz Studio',
      description:
        'An interactive dashboard builder for non-technical users to visualize business metrics.',
      tech: ['Vue', 'D3.js', 'Python', 'FastAPI', 'Redis'],
    },
    {
      title: 'AuthGuard',
      description:
        'A secure authentication microservice with OAuth, MFA, and audit logging.',
      tech: ['Next.js', 'Go', 'MongoDB', 'JWT', 'Docker'],
    },
  ];

  return (
    <section id="projects" className="py-24 px-6" aria-labelledby="projects-heading" role="region">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          id="projects-heading"
          className="text-3xl md:text-4xl font-display font-semibold text-[#1a2e1a] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {projectList.map((project, index) => (
            <article key={index} role="listitem">
              <ProjectCard
                title={project.title}
                description={project.description}
                tech={project.tech}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;