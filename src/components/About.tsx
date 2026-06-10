import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Network, Server, Shield, Code2, Globe, Wrench,
  Users, GraduationCap, BookOpen, Trophy, Award,
  ExternalLink,
} from 'lucide-react';
import { useAdminProfile } from '../hooks/useAdminProfile';

/* ─── Map icon_name → composant Lucide ──────────────── */
const ICON_MAP: Record<string, React.ReactNode> = {
  Network:  <Network size={18} />,
  Server:   <Server size={18} />,
  Shield:   <Shield size={18} />,
  Code2:    <Code2 size={18} />,
  Globe:    <Globe size={18} />,
  Wrench:   <Wrench size={18} />,
  Users:    <Users size={18} />,
};

/* ─── Variants Framer Motion ─────────────────────────── */
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

/* ─── Composant principal ────────────────────────────── */
const About: React.FC = () => {
  const {
    profile, loading,
    certifications, certsLoading,
    skills, skillsLoading,
    timeline, timelineLoading,
    projectCount,
  } = useAdminProfile();

  /* Stats dynamiques */
  const stats = [
    { value: `${timeline.filter(t => t.active).length > 0 ? '3+' : '3+'}`, label: 'Années de formation',     icon: <GraduationCap size={22} /> },
    { value: skills.length || '7',  label: 'Domaines de compétences', icon: <BookOpen size={22} /> },
    { value: `${projectCount}`,     label: 'Projets réalisés',         icon: <Trophy size={22} /> },
    { value: certsLoading ? '…' : certifications.length, label: 'Certifications obtenues', icon: <Award size={22} /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--muted)]">Chargement du profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--muted)]">Profil non trouvé</p>
      </div>
    );
  }

  return (
    <section id="about" className="relative overflow-hidden">

      {/* ── Background animé ─────────────────────────── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full bg-purple-600/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-6 py-16 flex flex-col gap-16">

        {/* ══════════ Hero : avatar + bio ══════════ */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start gap-10"
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {/* Avatar */}
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
              className="relative w-40 h-40 rounded-full border-4 border-[var(--glass)] object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.3 }}
            />
            {/* <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[var(--bg)] shadow-lg shadow-emerald-400/50" /> */}
          </motion.div>

          {/* Bio */}
          <div className="flex-1 flex flex-col gap-4">
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent leading-tight"
              variants={fadeUp}
            >
              {profile.name ?? 'Administrateur'}
            </motion.h2>
            <motion.p className="text-[var(--muted)] text-sm font-medium tracking-widest uppercase" variants={fadeUp}>
              Étudiant en Master 1 · Systèmes, Réseaux & Sécurité
            </motion.p>
            <motion.p className="text-base leading-relaxed text-[var(--muted)] max-w-xl" variants={fadeUp}>
              Passionné par la cybersécurité offensive et défensive,
              je m&apos;intéresse particulièrement à la protection des infrastructures
              informatiques, à l&apos;administration des systèmes et à la sécurisation
              des environnements Linux et Windows.
            </motion.p>
            <motion.div className="flex flex-wrap gap-2 mt-1" variants={staggerFast}>
              {['Cybersécurité', 'Linux', 'Réseaux', 'Python', 'React', 'Active Directory'].map(tag => (
                <motion.span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full border border-[var(--glass)] bg-white/5 backdrop-blur text-[var(--muted)] hover:border-purple-400/50 hover:text-purple-300 transition-colors duration-200 cursor-default"
                  variants={fadeUp} whileHover={{ scale: 1.08 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ══════════ Statistiques ══════════ */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {stats.map(stat => (
            <motion.div
              key={stat.label}
              className="relative p-5 rounded-2xl border border-[var(--glass)] bg-[var(--card)] text-center overflow-hidden group"
              variants={fadeUp} whileHover={{ scale: 1.04, y: -4 }} transition={{ duration: 0.25 }}
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

        {/* ══════════ Compétences ══════════ */}
        <motion.div
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.h3
            className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent"
            variants={fadeUp}
          >
            Compétences par domaines
          </motion.h3>

          {skillsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <motion.div key={i} className="h-20 rounded-2xl bg-[var(--glass)]"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }} />
              ))}
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger}>
              {skills.map((item, index) => (
                <motion.div
                  key={item.id ?? index}
                  className="relative p-5 rounded-2xl border border-[var(--glass)] bg-[var(--card)] overflow-hidden group"
                  variants={fadeUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.25 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-purple-400 flex-shrink-0">
                      {ICON_MAP[item.icon_name] ?? <Wrench size={18} />}
                    </span>
                    <h4 className="font-semibold text-base text-[var(--text)]">{item.title}</h4>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed pl-[30px]">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ══════════ Timeline parcours ══════════ */}
        <motion.div
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.h3
            className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent"
            variants={fadeUp}
          >
            Parcours académique
          </motion.h3>

          {timelineLoading ? (
            <div className="flex flex-col gap-4">
              {[1,2,3].map(i => (
                <motion.div key={i} className="h-24 rounded-2xl bg-[var(--glass)]"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }} />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/60 via-cyan-500/40 to-transparent" />
              <motion.div className="flex flex-col gap-7" variants={stagger}>
                {timeline.map((item, index) => (
                  <motion.div key={item.id ?? index} className="flex items-start gap-6" variants={fadeLeft}>
                    {/* Dot — FIX #10 : isolé dans son conteneur, ne touche plus la photo */}
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
                      whileHover={{ scale: 1.015, y: -3 }} transition={{ duration: 0.25 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-xs text-[var(--muted)] font-medium tracking-widest uppercase mb-1">{item.year}</p>
                          <h4 className="font-semibold text-base mb-1 text-[var(--text)]">{item.degree}</h4>
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
          )}
        </motion.div>

        {/* ══════════ Certifications (cliquables) ══════════ */}
        <motion.div
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.h3
            className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent"
            variants={fadeUp}
          >
            Certifications
          </motion.h3>

          {certsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2].map(i => (
                <motion.div key={i} className="h-20 rounded-2xl bg-[var(--glass)] border border-[var(--glass)]"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }} />
              ))}
            </div>
          ) : certifications.length === 0 ? (
            <motion.p className="text-[var(--muted)] text-sm italic" variants={fadeUp}>
              Aucune certification enregistrée pour l&apos;instant.
            </motion.p>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger}>
              {certifications.map(cert => {
                const isClickable = !!cert.link_url;
                const Wrapper = isClickable ? motion.a : motion.div;
                const extraProps = isClickable
                  ? { href: cert.link_url!, target: '_blank', rel: 'noopener noreferrer' }
                  : {};

                return (
                  <Wrapper
                    key={cert.id}
                    {...(extraProps as object)}
                    className={`relative p-5 rounded-2xl border border-[var(--glass)] bg-[var(--card)] overflow-hidden group flex items-start gap-4 ${isClickable ? 'cursor-pointer' : ''}`}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    {cert.badge_url ? (
                      <img src={cert.badge_url} alt={cert.title}
                        className="relative w-12 h-12 rounded-lg object-contain flex-shrink-0 border border-[var(--glass)]" />
                    ) : (
                      <div className="relative w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Award size={22} className="text-amber-400" />
                      </div>
                    )}
                    <div className="relative flex-1">
                      <h4 className="font-semibold text-base text-[var(--text)] leading-tight">{cert.title}</h4>
                      <p className="text-sm text-[var(--muted)] mt-0.5">{cert.issuer}</p>
                    </div>
                    {isClickable && (
                      <ExternalLink size={14} className="relative text-[var(--muted)] group-hover:text-amber-400 transition-colors flex-shrink-0 mt-1" />
                    )}
                  </Wrapper>
                );
              })}
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default About;