import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        relative flex flex-col items-center justify-center text-center py-20
        bg-gradient-to-b from-[var(--card)] to-[var(--bg)]
        text-[var(--text)]
        overflow-hidden
      "
    >
      {/* Overlay pour améliorer contraste */}
      <div className="absolute inset-0 bg-black/5 dark:bg-black/30" />

      {/* Contenu */}
      <div className="relative max-w-3xl">

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
          SECURITÉ CYBERMASTER | PENTESTER JUNIOR
        </h1>

        <p className="text-lg md:text-2xl mb-8 drop-shadow-sm text-[var(--text)]">
          Audit et sécurisation de systèmes d'information
        </p>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/projects"
            className="
              bg-[var(--accent)]
              text-[#061019]
              font-bold px-6 py-3 rounded-lg
              shadow-lg hover:bg-yellow-500
              transition
            "
          >
            Voir mes projets
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Hero;