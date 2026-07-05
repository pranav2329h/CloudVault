import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-700/80 relative z-10`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Close modal"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="mt-2 text-slate-600 dark:text-slate-300">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
