import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--card)]/80 backdrop-blur-md shadow-md rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-[var(--accent)] font-bold text-xl">Lightning</Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-white transition">Accueil</Link>
          <Link to="/projects" className="hover:text-white transition">Projets</Link>
          <Link to="/about" className="hover:text-white transition">À propos</Link>
          <Link to="/admin" className="hover:text-white transition">Admin</Link>
        </nav>
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <span className="material-icons text-[var(--accent)]">menu</span>
        </button>
      </div>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
};

export default Header;
