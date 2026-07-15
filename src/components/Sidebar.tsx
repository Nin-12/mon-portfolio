// src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — z-[200] pour passer au-dessus du canvas Hero */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panneau — z-[201] au-dessus de l'overlay */}
          <motion.div
            className="fixed left-0 top-0 w-64 h-full bg-[var(--card)] p-6 z-[201] flex flex-col"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25 }}
          >
            <button
              className="mb-6 text-[var(--muted)] hover:text-[var(--text)] transition text-left"
              onClick={onClose}
            >
              Fermer
            </button>

            <nav className="flex flex-col gap-4 text-[var(--text)]">
              <Link to="/"         onClick={onClose}>Accueil</Link>
              <Link to="/projects" onClick={onClose}>Projets</Link>
              <Link to="/about"    onClick={onClose}>À propos</Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;