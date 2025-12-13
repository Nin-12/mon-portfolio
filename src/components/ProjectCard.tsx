import React, { useState } from 'react';
import type { Project } from '../data/projects';


interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => setFlipped(!flipped);

  return (
    <div
      className="w-full perspective cursor-pointer"
      onClick={handleClick}
    >
      <div className={`relative w-full h-80 transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-[var(--card)] rounded-xl p-4 flex flex-col items-center justify-center">
          <img src={project.thumbnail} alt={project.title} className="w-full h-40 object-cover rounded-lg mb-2" />
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-sm">{project.category}</p>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[var(--card)] rounded-xl p-4 overflow-auto">
          <h3 className="text-lg font-bold mb-2">{project.title}</h3>
          <p className="text-sm mb-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.images.map((img, idx) => (
              <img key={idx} src={img} alt={`${project.title} ${idx}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
          {project.pdf && (
            <a href={project.pdf} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">
              Voir PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
