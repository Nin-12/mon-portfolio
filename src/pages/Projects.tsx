import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGrid from '../components/ProjectGrid';
import SkeletonGrid from '../components/SkeletonGrid';
import { useStorage } from '../hooks/useStorage';

const Projects: React.FC = () => {
  const { projects, loading } = useStorage();
  const [filter, setFilter] = useState('Tous');

  const categories = ['Tous', ...Array.from(new Set(
    projects.map(p => p.category ?? 'Autre')
  ))];

  const filtered = filter === 'Tous'
    ? projects
    : projects.filter(p => (p.category ?? 'Autre') === filter);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tous mes projets</h1>

      {/* Filtres — cachés pendant le loading */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition
                ${filter === cat
                  ? 'bg-[var(--accent)] text-[#061019] border-[var(--accent)]'
                  : 'border-[var(--glass)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skeleton pendant le chargement */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <p className="text-center text-[var(--muted)] mt-12">
          Aucun projet dans cette catégorie.
        </p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectGrid projects={filtered} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Projects;