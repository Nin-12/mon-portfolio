import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';
import ProjectCard from './ProjectCard';
import { easeOut } from "framer-motion";

interface ProjectGridProps {
  projects: Project[];
}

/* ================= ANIMATIONS ================= */

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12, // délai entre chaque card
      delayChildren: 0.1,    // petit délai au chargement
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          variants={cardVariants}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectGrid;