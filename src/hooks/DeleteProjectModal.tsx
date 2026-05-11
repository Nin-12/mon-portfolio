import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteProjectModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  open,
  title,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            className="relative w-full max-w-md mx-4 rounded-2xl border border-[var(--glass)] bg-[var(--card)] p-6 shadow-2xl"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <h2 className="text-lg font-bold text-[var(--text)] mb-2">
              Supprimer le projet
            </h2>

            <p className="text-sm text-[var(--muted)] mb-4">
              Cette action est irréversible.
            </p>

            <div className="p-3 rounded-lg border border-[var(--glass)] bg-[rgba(255,255,255,0.03)] mb-6">
              <span className="text-[var(--text)] font-semibold">
                {title}
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-[var(--glass)] text-[var(--text)] hover:border-[var(--accent)] transition"
              >
                Annuler
              </button>

              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition disabled:opacity-50"
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteProjectModal;