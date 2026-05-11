import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import ProjectGrid from '../components/ProjectGrid';
import SkeletonGrid from '../components/SkeletonGrid';
import { useStorage } from '../hooks/useStorage';

const Home: React.FC = () => {
  const { projects, loading } = useStorage();
  const preview = projects.slice(0, 6);

  return (
    <div className="container mx-auto p-4">
      <Hero />
      <About />

      <h2 className="text-2xl font-bold mt-8 mb-4">Projets récents</h2>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : (
        <ProjectGrid projects={preview} />
      )}
    </div>
  );
};

export default Home;