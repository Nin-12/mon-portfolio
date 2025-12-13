import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-[#071026] to-[#081423] text-white">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          SECURITÉ CYBERMASTER | PENTEST JUNIOR
        </h1>
        <p className="text-lg md:text-2xl mb-8 drop-shadow-md">
          Audit et sécurisation de systèmes d'information
        </p>
        <a href="#projects" className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-500 transition">
          Voir mes projets
        </a>
      </div>
    </section>
  );
};

export default Hero;
