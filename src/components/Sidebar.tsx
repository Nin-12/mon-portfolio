import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed left-0 top-0 w-64 h-full bg-[var(--card)] p-6 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="mb-6" onClick={onClose}>Fermer</button>
        <nav className="flex flex-col gap-4">
          <Link to="/" onClick={onClose}>Accueil</Link>
          <Link to="/projects" onClick={onClose}>Projets</Link>
          <Link to="/about" onClick={onClose}>À propos</Link>
          <Link to="/admin" onClick={onClose}>Admin</Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
