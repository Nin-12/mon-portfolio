import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft, Github, FileText, X, ExternalLink,
  Calendar, Tag, Image as ImageIcon,
} from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import type { Project } from '../data/projects';
import ProjectGrid from '../components/ProjectGrid';

/* ─── Variants Framer Motion (cohérents avec About.tsx) ──── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

/* ─── Formatage de date FR ────────────────────────────────── */
const formatDate = (iso?: string) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  } catch {
    return null;
  }
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, loading } = useStorage();

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  /* ─── Projet courant ─────────────────────────────────── */
  const project: Project | null = useMemo(() => {
    if (!id || loading) return null;
    return projects.find(p => p.id === id) ?? null;
  }, [projects, id, loading]);

  /* ─── Galerie d'images ───────────────────────────────── */
  const displayedImage = activeImage || project?.thumbnail || null;

  const allImages = useMemo(() => {
    if (!project) return [];
    const images = [project.thumbnail, ...(project.images ?? [])]
      .filter((img): img is string => Boolean(img));
    return Array.from(new Set(images));
  }, [project]);

  /* ─── Projets similaires (même catégorie, hors projet actuel) ─── */
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return projects
      .filter(p => p.id !== project.id && (p.category ?? 'Autre') === (project.category ?? 'Autre'))
      .slice(0, 3);
  }, [projects, project]);

  const formattedDate = project ? formatDate(project.created_at) : null;
  const hasLinks = !!(project?.links?.length || project?.github_url || project?.pdf);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="w-28 h-8 rounded-lg bg-[var(--glass)] mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full h-80 rounded-2xl bg-[var(--glass)] animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-24 rounded-full bg-[var(--glass)] animate-pulse" />
            <div className="h-9 w-3/4 rounded-md bg-[var(--glass)] animate-pulse" />
            <div className="h-24 w-full rounded-md bg-[var(--glass)] animate-pulse" />
            <div className="h-32 w-full rounded-md bg-[var(--glass)] animate-pulse mt-4" />
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
        <p className="text-[var(--muted)] mb-6 max-w-md">
          Ce projet n&apos;existe pas ou a été retiré.
        </p>
        <button
          onClick={() => navigate('/projects')}
          className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-3 rounded-lg hover:brightness-110 transition"
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
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
          >
            <button
              className="absolute top-5 right-5 text-white/80 hover:text-white transition"
              aria-label="Fermer"
            >
              <X size={28} />
            </button>
            <motion.img
              src={zoomedImage}
              alt="Zoom"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden">
        {/* ── Halos décoratifs, cohérents avec About.tsx ── */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[360px] h-[360px] rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute bottom-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <motion.div
          className="container mx-auto p-6 max-w-5xl"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {/* ── Retour ── */}
          <motion.button
            variants={fadeUp}
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 mb-8 px-3 py-1.5 -ml-3 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--glass)] transition group w-fit"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Retour aux projets</span>
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ══════════ GAUCHE — Galerie ══════════ */}
            <motion.div className="flex flex-col gap-3" variants={fadeUp}>
              <motion.div
                className="relative w-full h-80 rounded-2xl overflow-hidden border border-[var(--glass)] bg-[var(--card)] cursor-zoom-in shadow-xl"
                onClick={() => displayedImage && setZoomedImage(displayedImage)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {displayedImage ? (
                    <motion.img
                      key={displayedImage}
                      src={displayedImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                      <ImageIcon size={40} />
                    </div>
                  )}
                </AnimatePresence>

                {/* Badge catégorie flottant sur l'image */}
                {project.category && (
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg)]/85 backdrop-blur border border-[var(--glass)] text-[var(--accent)]">
                    <Tag size={12} /> {project.category}
                  </span>
                )}
              </motion.div>

              {allImages.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition
                        ${displayedImage === img ? 'border-[var(--accent)]' : 'border-transparent hover:border-[var(--glass)]'}`}
                      aria-label={`Voir l'image ${idx + 1}`}
                    >
                      <img src={img} alt="miniature" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ══════════ DROITE — Infos ══════════ */}
            <motion.div className="flex flex-col gap-5" variants={fadeUp}>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] leading-tight mb-2">
                  {project.title}
                </h1>
                {formattedDate && (
                  <p className="flex items-center gap-1.5 text-xs text-[var(--muted)] uppercase tracking-wide font-medium">
                    <Calendar size={13} /> {formattedDate}
                  </p>
                )}
              </div>

              {project.description && (
                <p className="text-sm md:text-base leading-relaxed text-[var(--muted)]">
                  {project.description}
                </p>
              )}

              {/* ── Liens ressources ── */}
              {hasLinks && (
                <div className="flex flex-col gap-2.5 pt-2">
                  {project.links?.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--glass)] bg-[var(--card)] hover:border-[var(--accent)] transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                        <ExternalLink size={16} />
                      </span>
                      <span className="text-sm font-semibold text-[var(--text)] flex-1">{link.label}</span>
                      <ExternalLink size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                    </a>
                  ))}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--glass)] bg-[var(--card)] hover:border-[var(--accent)] transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                        <Github size={16} />
                      </span>
                      <span className="text-sm font-semibold text-[var(--text)] flex-1">Voir sur GitHub</span>
                      <ExternalLink size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                    </a>
                  )}

                  {project.pdf && (
                    <a
                      href={project.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--glass)] bg-[var(--card)] hover:border-[var(--accent)] transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                        <FileText size={16} />
                      </span>
                      <span className="text-sm font-semibold text-[var(--text)] flex-1">Voir le PDF</span>
                      <ExternalLink size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* ══════════ Détails du projet ══════════ */}
          {project.details && (
            <motion.div
              className="mt-14 p-6 md:p-8 rounded-2xl border border-[var(--glass)] bg-[var(--card)]"
              variants={fadeUp}
            >
              <h2 className="text-xl font-bold mb-6 text-[var(--text)]">Détails du projet</h2>
              <div
                className="tiptap-render"
                dangerouslySetInnerHTML={{ __html: project.details }}
              />
            </motion.div>
          )}

          {/* ══════════ Projets similaires ══════════ */}
          {relatedProjects.length > 0 && (
            <motion.div className="mt-16" variants={fadeUp}>
              <h2 className="text-xl font-bold mb-6 text-[var(--text)]">
                Autres projets {project.category ? `en ${project.category}` : 'similaires'}
              </h2>
              <ProjectGrid projects={relatedProjects} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProjectDetail;