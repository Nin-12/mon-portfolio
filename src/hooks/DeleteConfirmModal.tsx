// src/hooks/DeleteConfirmModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  open: boolean;
  label: string;
  itemName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open, label, itemName, loading = false, onCancel, onConfirm,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-sm bg-[var(--card)] border border-[var(--glass)] rounded-2xl p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={22} className="text-red-400 flex-shrink-0" />
              <h3 className="text-base font-bold text-[var(--text)]">
                Confirmer la suppression
              </h3>
            </div>

            <p className="text-sm text-[var(--muted)] mb-2">
              Voulez-vous vraiment supprimer {label}&nbsp;?
            </p>
            {itemName && (
              <p className="text-sm font-semibold text-[var(--text)] mb-5 truncate">
                « {itemName} »
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-[var(--glass)] text-[var(--muted)] text-sm hover:border-[var(--accent)] transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-60"
              >
                {loading ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;