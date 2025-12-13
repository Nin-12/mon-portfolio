import React from 'react';
import Hero from '../components/Hero';
import About from './about.tsx';
import ProjectGrid from '../components/ProjectGrid.tsx';
import { useStorage } from '../hooks/useStorage.ts';

const Home: React.FC = () => {
  const { projects } = useStorage();
  const preview = projects.slice(0, 6);


  return (
    <div className="container mx-auto p-4">
      <Hero />
      <About />
      <h2 className="text-2xl font-bold mt-8 mb-4">Projets récents</h2>
      <ProjectGrid projects={preview} />
    </div>
  );
};

export default Home;
