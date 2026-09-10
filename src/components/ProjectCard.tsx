import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MousePointer } from 'lucide-react';
import type { Project } from '../data/projects';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  /** Seule la première carte de la grille joue le didacticiel (passer isFirstCard={index === 0} depuis ProjectGrid) */
  isFirstCard?: boolean;
}

const TUTORIAL_KEY = 'has_seen_flip_tutorial';

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isFirstCard = false }) => {
  const [flipped, setFlipped] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    const showTooltip = () => {
      setShowTip(true);
      hideTimeout = setTimeout(() => setShowTip(false), 2500);
    };

    const initialTimeout = setTimeout(() => {
      showTooltip();
      interval = setInterval(showTooltip, 60000);
    }, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════
     DIDACTICIEL "SOURIS VIRTUELLE" — ajouté sans modifier le reste
  ═══════════════════════════════════════════════════════════ */
  const cardRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null); // conteneur scrollable du dos de la carte
  const pdfLinkRef = useRef<HTMLAnchorElement>(null); // lien "Voir le PDF", cible du scroll interne
  const inView = useInView(cardRef, { once: true, amount: 0.5 });
  const hasStartedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [tutorialPlaying, setTutorialPlaying] = useState(false);
  const [showMouse, setShowMouse] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 18, y: 18 });
  const [clickPulse, setClickPulse] = useState(false);
  const [highlightButton, setHighlightButton] = useState(false);
  const [highlightGallery, setHighlightGallery] = useState(false);
  const [highlightPdf, setHighlightPdf] = useState(false);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  }, []);

  const markSeen = () => {
    try { localStorage.setItem(TUTORIAL_KEY, 'true'); } catch { /* localStorage indisponible : on ignore */ }
  };

  const finishTutorial = useCallback(() => {
    clearAllTimeouts();
    setShowMouse(false);
    setClickPulse(false);
    setHighlightButton(false);
    setHighlightGallery(false);
    setHighlightPdf(false);
    // Remet le scroll interne du dos de carte à zéro, pour un vrai utilisateur qui flipperait la carte plus tard
    backFaceRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    setTutorialPlaying(false);
    markSeen();
  }, [clearAllTimeouts]);

  const playTutorial = useCallback(() => {
    setTutorialPlaying(true);
    setShowMouse(true);
    setMousePos({ x: 18, y: 18 });

    // 1. Déplacement vers le centre de la carte
    schedule(() => setMousePos({ x: 50, y: 48 }), 500);

    // 2. Clic simulé → flip
    schedule(() => setClickPulse(true), 1300);
    schedule(() => setFlipped(true), 1350);
    schedule(() => setClickPulse(false), 1650);

    // 3. Déplacement vers le bouton "Voir la page complète" (juste sous le titre/description)
    schedule(() => {
      setMousePos({ x: 50, y: 38 });
      setHighlightButton(true);
    }, 2200);
    schedule(() => setClickPulse(true), 2750);
    schedule(() => setClickPulse(false), 3050);
    schedule(() => setHighlightButton(false), 3200);

    // 4. Déplacement vers la 1ère miniature de galerie — simple surbrillance,
    //    comme pour le bouton, SANS déclencher le zoom plein écran.
    schedule(() => {
      setMousePos({ x: 22, y: 55 });
      setHighlightGallery(true);
    }, 3400);
    schedule(() => setHighlightGallery(false), 4200);

    // 5. Le lien "Voir le PDF" est plus bas que la zone visible du dos de carte
    //    (conteneur en overflow-y-auto) → on le fait défiler dans la carte AVANT
    //    de positionner la souris dessus, sinon il resterait invisible/hors-champ.
    schedule(() => {
      pdfLinkRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 4400);
    schedule(() => {
      // Une fois le scroll interne terminé, le lien est centré verticalement
      // dans la carte (block: 'center') → la souris peut viser ce point précisément.
      setMousePos({ x: 32, y: 50 });
      setHighlightPdf(true);
    }, 4750);
    schedule(() => setClickPulse(true), 5350);
    schedule(() => setClickPulse(false), 5650);
    schedule(() => setHighlightPdf(false), 5800);
    schedule(() => backFaceRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 5850);

    // 6. Disparition + remise à l'état normal pour l'utilisateur réel
    schedule(() => setShowMouse(false), 6200);
    schedule(() => setFlipped(false), 6600);
    schedule(() => finishTutorial(), 6650);
  }, [schedule, finishTutorial]);

  useEffect(() => {
    if (!isFirstCard) return;
    if (!inView) return;
    if (hasStartedRef.current) return;

    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem(TUTORIAL_KEY) === 'true'; } catch { /* ignore */ }
    if (alreadySeen) return;

    hasStartedRef.current = true;
    const startId = setTimeout(() => playTutorial(), 700);
    timeoutsRef.current.push(startId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isFirstCard]);

  useEffect(() => () => clearAllTimeouts(), [clearAllTimeouts]);

  /* Interruption sur activité réelle de l'utilisateur : bouger la souris
     ou toucher l'écran pendant la démo l'arrête immédiatement (en plus
     du clic, déjà géré via handleCardClick plus bas). Notre propre
     animation est pilotée par React (pas de vrais événements souris),
     donc elle ne déclenche jamais ces écouteurs. */
  useEffect(() => {
    if (!tutorialPlaying) return;

    const stopOnUserActivity = () => finishTutorial();

    window.addEventListener('mousemove', stopOnUserActivity);
    window.addEventListener('touchstart', stopOnUserActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', stopOnUserActivity);
      window.removeEventListener('touchstart', stopOnUserActivity);
    };
  }, [tutorialPlaying, finishTutorial]);

  return (
    <>
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={hoveredImage}
              alt="Zoom"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="w-full flex justify-start relative" style={{ perspective: "1000px" }}>
          
          <AnimatePresence>
            {showTip && (
              <motion.div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <div className="bg-[var(--card)] border border-[var(--glass)] text-[var(--text)] px-4 py-2 rounded-xl shadow-lg text-sm whitespace-nowrap">
                  Cliquez pour explorer les projets
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="max-w-[310px] w-full cursor-pointer relative"
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => {
              if (tutorialPlaying) finishTutorial();
              setFlipped(!flipped);
              setShowTip(false);
            }}
          >
            <motion.div
                className="relative w-full h-80"
                initial={false}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ 
                  duration: 0.6, 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20 
                }}
                style={{ transformStyle: "preserve-3d" }}
            >

              {/* FRONT */}

              <div 
                className="absolute inset-0 bg-[var(--card)] rounded-xl p-6 shadow-xl flex flex-col items-center justify-center text-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded-lg mb-4" 
                  />
                )}
                
                {/* Ce conteneur gère l'espacement entre titre et catégorie avec un gap précis */}
                <div className="flex flex-col gap-3"> 
                  <h3 className="text-xl font-bold leading-tight">{project.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{project.category}</p>
                </div>
              </div>

              {/* BACK */}
              <div 
                ref={backFaceRef}
                className="absolute inset-0 bg-[var(--card)] rounded-xl p-4 overflow-y-auto shadow-xl"
                style={{ 
                  backfaceVisibility: "hidden", 
                  transform: "rotateY(180deg)"
                }}
              >
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <p className="text-sm mb-4 line-clamp-3">{project.description}</p>
                
                {/* Bouton en haut */}
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     navigate(`/projects/${project.id}`);
                   }}
                   className={`mb-4 w-full text-center text-xs font-semibold bg-[var(--accent)] text-[#061019] hover:opacity-90 transition rounded-lg py-2 ${highlightButton ? 'ring-4 ring-[var(--accent)]/40 ring-offset-2 ring-offset-[var(--card)] scale-105' : ''}`}
                 >
                   Voir la page complète →
                 </button>

                <div className="flex flex-wrap gap-3 mb-5">
                  {project.images?.map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-lg overflow-hidden border cursor-zoom-in transition ${
                        idx === 0 && highlightGallery
                          ? 'ring-4 ring-[var(--accent)]/40 ring-offset-2 ring-offset-[var(--card)] scale-105 border-[var(--accent)]'
                          : 'border-[var(--glass)]'
                      }`}
                      onMouseEnter={() => setHoveredImage(img)}
                      onMouseLeave={() => setHoveredImage(null)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="gallery" />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.02 10.02 0 0022 12.017C22 6.484 17.523 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Voir sur GitHub
                    </a>
                  )}

                  {project.pdf && (
                    <a 
                      ref={pdfLinkRef}
                      href={project.pdf} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className={`flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline w-fit transition ${
                        highlightPdf
                          ? 'ring-4 ring-[var(--accent)]/40 ring-offset-2 ring-offset-[var(--card)] scale-105 rounded-lg px-2 py-1 -mx-2 -my-1'
                          : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Voir le PDF
                    </a>
                  )}

                </div>
              </div>

            </motion.div>

            {/* ══════════ Souris virtuelle du didacticiel ══════════ */}
            <AnimatePresence>
              {showMouse && (
                <motion.div
                  className="absolute z-40 pointer-events-none"
                  style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%`, translateX: '-50%', translateY: '-50%' }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: clickPulse ? 0.82 : 1,
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    left: { duration: 0.6, ease: 'easeInOut' },
                    top: { duration: 0.6, ease: 'easeInOut' },
                    scale: { duration: 0.15 },
                    opacity: { duration: 0.35 },
                  }}
                >
                  {clickPulse && (
                    <motion.span
                      className="absolute inset-0 -m-3 rounded-full border-2 border-[var(--accent)]"
                      initial={{ scale: 0.3, opacity: 0.7 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  )}
                  <MousePointer
                    size={26}
                    className="text-[var(--accent)] drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectCard;