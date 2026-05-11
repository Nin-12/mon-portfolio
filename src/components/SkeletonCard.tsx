import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard: React.FC = () => {
  return (
    <div className="max-w-[320px] w-full bg-[var(--card)] rounded-xl p-6 flex flex-col gap-3 border border-[var(--glass)]">

      {/* thumbnail */}
      <motion.div
        className="w-full h-40 rounded-lg bg-[var(--glass)]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* title */}
      <motion.div
        className="h-4 w-3/4 rounded-md bg-[var(--glass)]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      />

      {/* category */}
      <motion.div
        className="h-3 w-1/2 rounded-md bg-[var(--glass)]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />

    </div>
  );
};

export default SkeletonCard;