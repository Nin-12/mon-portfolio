import React from 'react';
import About from '../components/about';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">À propos</h1>
      <About />
    </div>
  );
};

export default AboutPage;
