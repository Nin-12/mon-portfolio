import React from 'react';
import ProjectGrid from '../components/ProjectGrid';
import { useStorage } from '../hooks/useStorage';

const Projects: React.FC = () => {
  const { projects } = useStorage();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tous mes projets</h1>
      <ProjectGrid projects={projects} />
    </div>
  );
};

export default Projects;
