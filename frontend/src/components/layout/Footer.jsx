import React from 'react';
import { APP_NAME } from '../../utils/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-4 md:px-8 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{APP_NAME}</span>
        <span>&copy; {currentYear} All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Terms of Service
        </a>
        <a href="#security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Security
        </a>
        <a href="#help" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Help Center
        </a>
      </div>
    </footer>
  );
};

export default Footer;
