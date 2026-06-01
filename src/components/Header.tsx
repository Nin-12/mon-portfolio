import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[var(--card)]/80 backdrop-blur-md shadow-md rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center p-4">

        <Link to="/" className="text-[var(--accent)] font-bold text-xl">
          Lightning
        </Link>

        <nav className="hidden md:flex gap-6 items-center">

          <Link to="/" className="hover:text-[var(--accent)] transition">
            Accueil
          </Link>

          <Link to="/projects" className="hover:text-[var(--accent)] transition">
            Projets
          </Link>

          <Link to="/about" className="hover:text-[var(--accent)] transition">
            À propos
          </Link>

          <button
            onClick={toggle}
            className="ml-2 p-2 rounded-lg border border-[var(--glass)] hover:bg-[var(--glass)] transition"
            aria-label="Changer le thème"
          >
            {dark ? (
              <Sun  size={18} className="text-[var(--accent)]" />
            ) : (
              <Moon size={18} className="text-[var(--muted)]" />
            )}
          </button>

        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <span className="material-icons text-[var(--accent)]">menu</span>
        </button>

      </div>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
};

export default Header;