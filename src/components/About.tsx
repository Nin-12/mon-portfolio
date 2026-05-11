import React from 'react';
import { motion } from 'framer-motion';
import { useAdminProfile } from '../hooks/useAdminProfile';

const About: React.FC = () => {
  const { profile, loading } = useAdminProfile();

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Profil non trouvé</p>;

  return (
    <motion.section
      id="about"
      className="container mx-auto p-6 flex flex-col md:flex-row items-start gap-10"
      
      /* Animation section */
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >

      {/* ================= Avatar ================= */}
      <motion.img
        src={profile.avatar}
        alt="Avatar admin"
        className="w-40 h-40 rounded-full border-4 border-[var(--glass)] object-cover"
        
        /* Animation apparition */
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}

        /* Hover animation */
        whileHover={{ scale: 1.05 }}
      />

      {/* ================= Texte ================= */}
      <div className="flex-1">

        {/* ================= Nom ================= */}
        <motion.h2
          className="text-3xl font-bold mb-1"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {profile.name ?? 'Administrateur'}
        </motion.h2>

        {/* ================= Niveau d'étude ================= */}
        <motion.p
          className="text-[var(--muted)] text-sm mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
           Étudiant en Master 1 en Systèmes, Réseaux et Sécurité
        </motion.p>

        {/* ================= Description ================= */}
        <motion.p
          className="mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Passionné par la cybersécurité offensive et défensive, 
          je m'intéresse particulièrement à la protection des infrastructures 
          informatiques, à l’administration des systèmes et à la sécurisation 
          des environnements Linux et Windows.
        </motion.p>

        {/* ================= Titre compétences ================= */}
        <motion.h3
          className="text-xl font-semibold mt-6 mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          Compétences par domaines
        </motion.h3>

        {/* ================= GRID ANIMÉ ================= */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"

          /* Animation stagger */
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}

          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >

          {[
            {
              title: "Administration Réseaux",
              text: "TCP/IP, VLAN, Firewall, Routage, Audit réseau, Analyse & surveillance (SOC)."
            },
            {
              title: "Administration Systèmes",
              text: "Linux (Debian, Ubuntu, Kali), Windows Server (Active Directory), Gestion utilisateurs, Durcissement systèmes."
            },
            {
              title: "Cybersécurité",
              text: "Gestion des vulnérabilités, Tests d’intrusions basiques, Sécurité d’infrastructures, virtualisation (VMware, VirtualBox)."
            },
            {
              title: "Programmation & Scripts",
              text: " Algorithmique, Python (basique), Bash (scripting)."
            },
            {
              title: "Développement Web",
              text: "HTML, CSS, JavaScript, React, TypeScript, Tailwind, UI/UX, responsive."
            },
            {
              title: "Outils & Gestion",
              text: "Git, GitHub, Supabase, Documentation technique."
            },
            {
              title: "Compétences transversales",
              text: "Résolution de problèmes, Esprit d'équipe, Communication efficace, Adaptabilité, Créativité, Apprentissage continu."
            }
          ].map((item, index) => (

            <motion.div
              key={index}
              className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow transition"

              /* Animation apparition */
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}

              /* Hover animation */
              whileHover={{
                scale: 1.02,
                y: -4
              }}

              transition={{ duration: 0.3 }}
            >
              <h4 className="font-semibold text-lg mb-2">
                {item.title}
              </h4>

              <p className="text-sm">
                {item.text}
              </p>

            </motion.div>
          ))}

        </motion.div>

      </div>
    </motion.section>
  );
};

export default About;