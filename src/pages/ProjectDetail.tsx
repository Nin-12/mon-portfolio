import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, FileText, X, ExternalLink } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import type { Project } from '../data/projects';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, loading } = useStorage();

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  /* ===============================
      DERIVED PROJECT
  =============================== */
  const project: Project | null = useMemo(() => {
    if (!id || loading) return null;
    return projects.find(p => p.id === id) ?? null;
  }, [projects, id, loading]);

  /* ===============================
      IMAGE LOGIC (Fixed)
  =============================== */
  const displayedImage = activeImage || project?.thumbnail || null;

  const allImages = useMemo(() => {
    if (!project) return [];
    
    const images = [
      project.thumbnail,
      ...(project.images ?? [])
    ].filter((img): img is string => Boolean(img));

    return Array.from(new Set(images));
  }, [project]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="w-24 h-8 rounded-lg bg-[var(--glass)] mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full h-72 rounded-2xl bg-[var(--glass)] animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-8 w-3/4 rounded-md bg-[var(--glass)] animate-pulse" />
            <div className="h-32 w-full rounded-md bg-[var(--glass)] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ================= 404 ================= */
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h1 className="text-4xl font-extrabold text-[var(--accent)] mb-4">Projet introuvable</h1>
        <button
          onClick={() => navigate('/projects')}
          className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
        >
          Retour aux projets
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ================= ZOOM IMAGE ================= */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
          >
            <button className="absolute top-5 right-5 text-white hover:text-[var(--accent)]">
              <X size={28} />
            </button>
            <motion.img
              src={zoomedImage}
              alt="Zoom"
              className="max-w-full max-h-full object-contain rounded-xl"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="container mx-auto p-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 mb-8 text-[var(--muted)] hover:text-[var(--accent)] group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Retour aux projets</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* GAUCHE — Images */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="relative w-full h-72 rounded-2xl overflow-hidden border border-[var(--glass)] cursor-zoom-in"
              onClick={() => displayedImage && setZoomedImage(displayedImage)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={displayedImage}
                  src={displayedImage || ''}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </motion.div>

            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition
                      ${displayedImage === img ? 'border-[var(--accent)]' : 'border-transparent'}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DROITE — Infos */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.category && (
              <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-black text-xs font-bold w-fit">
                {project.category}
              </span>
            )}
            <p className="text-sm text-[var(--muted)]">{project.description}</p>

            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-[var(--glass)]">

              {/* LIEN AUTOMATIQUE */}
              {project.links?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--glass)] hover:border-[var(--accent)] transition"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm font-semibold">{link.label}</span>
                  </a>
                ))}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--glass)] hover:border-[var(--accent)] transition"
                >
                  <Github size={18} />
                  <span className="text-sm font-semibold">Voir sur GitHub</span>
                </a>
              )}
              {project.pdf && (
                <a
                  href={project.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--glass)] hover:border-[var(--accent)] transition"
                >
                  <FileText size={18} />
                  <span className="text-sm font-semibold">Voir le PDF</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {project.details && (
          <div className="mt-12 pt-8 border-t border-[var(--glass)]">
            <h2 className="text-xl font-bold mb-6">Détails du projet</h2>

            <div
              className="tiptap-render"
              dangerouslySetInnerHTML={{
                __html: project.details,
              }}
            />
          </div>
       )}
      </motion.div>
    </>
  );
};

export default ProjectDetail;