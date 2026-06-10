// src/components/Home.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { GraduationCap, BookOpen, Award, FolderKanban } from 'lucide-react';

import Hero        from './Hero';
import ProjectGrid from './ProjectGrid';
import SkeletonGrid from './SkeletonGrid';
import { useStorage }      from '../hooks/useStorage';
import { useAdminProfile } from '../hooks/useAdminProfile';

/* ── Variants Framer Motion ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};
const staggerFast: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

/* ════════════════════════════════════════════ */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading } = useStorage();
  const {
    profile,
    certifications, certsLoading,
    skills,
    timeline, timelineLoading,
    projectCount,
  } = useAdminProfile();

  /* Préfère projectCount (realtime) sinon longueur locale */
  const projCount = projectCount > 0 ? projectCount : projects.length;

  /* 6 projets récents */
  const preview = useMemo(() => projects.slice(0, 6), [projects]);

  /* Stats dynamiques */
  const stats = useMemo(() => [
    {
      value: '3+',
      label: 'Années de formation',
      icon: <GraduationCap size={22} />,
    },
    {
      value: skills.length > 0 ? String(skills.length) : '7',
      label: 'Domaines de compétences',
      icon: <BookOpen size={22} />,
    },
    {
      value: String(projCount),
      label: 'Projets réalisés',
      icon: <FolderKanban size={22} />,
    },
    {
      value: certsLoading ? '…' : String(certifications.length),
      label: 'Certifications obtenues',
      icon: <Award size={22} />,
    },
  ], [skills.length, projCount, certsLoading, certifications.length]);

  return (
    <div className="container mx-auto px-4 pb-12">

      {/* ══════════ Hero statique ══════════ */}
      <Hero />

      {/* ══════════ BIO ══════════ */}
      {profile && (
        <motion.div
          className="mt-12"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {/* Avatar + texte */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-start gap-10"
            variants={stagger}
          >
            {/* Avatar animé */}
            <motion.div className="relative flex-shrink-0" variants={fadeUp}>
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-cyan-400 to-emerald-400 blur-sm opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.img
                key={profile.avatar}
                src={profile.avatar}
                alt="Avatar"
                width={160}
                height={160}
                loading="eager"
                fetchPriority="high"
                className="relative w-40 h-40 rounded-full border-4 border-[var(--glass)] object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Texte bio */}
            <div className="flex-1 flex flex-col gap-4">
              <motion.h2
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent leading-tight"
                variants={fadeUp}
              >
                {profile.name ?? 'Administrateur'}
              </motion.h2>

              <motion.p
                className="text-[var(--muted)] text-sm font-medium tracking-widest uppercase"
                variants={fadeUp}
              >
                Étudiant en Master 1 · Systèmes, Réseaux & Sécurité
              </motion.p>

              <motion.p
                className="text-base leading-relaxed text-[var(--muted)] max-w-xl"
                variants={fadeUp}
              >
                Passionné par la cybersécurité offensive et défensive,
                je m&apos;intéresse particulièrement à la protection des infrastructures
                informatiques, à l&apos;administration des systèmes et à la sécurisation
                des environnements Linux et Windows.
              </motion.p>

              {/* Badges */}
              <motion.div className="flex flex-wrap gap-2 mt-1" variants={staggerFast}>
                {['Cybersécurité', 'Linux', 'Réseaux', 'Python', 'React', 'Active Directory'].map(tag => (
                  <motion.span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full border border-[var(--glass)] bg-white/5 backdrop-blur text-[var(--muted)] hover:border-purple-400/50 hover:text-purple-300 transition-colors duration-200 cursor-default"
                    variants={fadeUp}
                    whileHover={{ scale: 1.08 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ══════════ Statistiques ══════════ */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {stats.map(stat => (
              <motion.div
                key={stat.label}
                className="relative p-5 rounded-2xl border border-[var(--glass)] bg-[var(--card)] text-center overflow-hidden group"
                variants={fadeUp}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="flex justify-center mb-2 text-purple-400">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1 leading-snug">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* ══════════ Bouton CTA ══════════ */}
           <motion.div
                    className="flex justify-center mt-10"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.button
                      onClick={() => navigate('/about')}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-purple-500/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Voir le profil complet →
                    </motion.button>
                  </motion.div>
                </motion.div>       
           )}

          {/* ══════════ Timeline parcours ══════════ */}
          {!timelineLoading && timeline.length > 0 && (
            <motion.div
              className="mt-12"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
            >
              <motion.h3
                className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent"
                variants={fadeUp}
              >
                Parcours académique
              </motion.h3>

              <div className="relative">
                {/* Ligne verticale */}
                <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/60 via-cyan-500/40 to-transparent" />

                <motion.div className="flex flex-col gap-7" variants={stagger}>
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.id ?? index}
                      className="flex items-start gap-6"
                      variants={fadeLeft}
                    >
                      {/* Dot */}
                      <div className="relative flex-shrink-0 w-[14px] mt-1">
                        {item.active && (
                          <motion.span
                            className="absolute inset-0 rounded-full bg-purple-400 opacity-40"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        <span className={`relative block w-[14px] h-[14px] rounded-full border-2 z-10 ${
                          item.active
                            ? 'bg-purple-400 border-purple-400 shadow-lg shadow-purple-400/50'
                            : 'bg-[var(--bg)] border-[var(--glass)]'
                        }`} />
                      </div>

                      {/* Carte */}
                      <motion.div
                        className="flex-1 p-5 rounded-2xl border border-[var(--glass)] bg-[var(--card)] group relative overflow-hidden"
                        whileHover={{ scale: 1.015, y: -3 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <p className="text-xs text-[var(--muted)] font-medium tracking-widest uppercase mb-1">
                              {item.year}
                            </p>
                            <h4 className="font-semibold text-base mb-1 text-[var(--text)]">
                              {item.degree}
                            </h4>
                            <p className="text-sm text-[var(--muted)]">{item.school}</p>
                          </div>
                          <span className={`flex-shrink-0 inline-block px-3 py-1 rounded-full text-xs font-medium ${item.badge_color}`}>
                            {item.badge}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Skeleton timeline */}
          {timelineLoading && (
            <div className="mt-12 flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="h-24 rounded-2xl bg-[var(--glass)]"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              ))}
            </div>
          )}

        

      {/* Skeleton profil pendant chargement */}
      {!profile && (
        <div className="mt-12 flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <motion.div
              className="w-40 h-40 rounded-full bg-[var(--glass)] flex-shrink-0"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <div className="flex flex-col gap-3 flex-1">
              <motion.div className="h-8 w-2/3 rounded-md bg-[var(--glass)]"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }} />
              <motion.div className="h-4 w-1/2 rounded-md bg-[var(--glass)]"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.1 }} />
              <motion.div className="h-16 w-full rounded-md bg-[var(--glass)]"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }} />
            </div>
          </div>
        </div>
      )}

      {/* ══════════ Projets récents ══════════ */}
      <h2 className="text-2xl font-bold mt-14 mb-4 text-[var(--text)]">
        Projets récents
      </h2>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : (
        <ProjectGrid projects={preview} />
      )}
    </div>
  );
};

export default Home;