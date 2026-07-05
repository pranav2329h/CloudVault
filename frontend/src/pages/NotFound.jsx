import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiCompass } from 'react-icons/fi';
import Button from '../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800"
      >
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <FiCompass className="w-10 h-10 animate-pulse" />
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-3 inline-block">
          Error 404
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
          Page not found
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          The page or file you are looking for might have been removed, renamed, or is temporarily unavailable in CloudVault.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            icon={FiArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" icon={FiHome} className="w-full sm:w-auto">
              Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
