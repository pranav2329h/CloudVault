import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiCloud, FiX, FiHardDrive, FiArrowUpRight } from 'react-icons/fi';
import { NAV_ITEMS, APP_NAME } from '../../utils/constants';
import storageService from '../../services/storageService';
import { formatFileSize } from '../../utils/formatters';

export const Sidebar = ({ isOpen, onClose }) => {
  const [storage, setStorage] = useState({
    usedBytes: 8 * 1024 * 1024 * 1024,
    totalBytes: 15 * 1024 * 1024 * 1024,
    percentage: 56.7
  });

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const data = await storageService.getStorageMetrics();
        if (data) {
          setStorage({
            usedBytes: data.usedBytes || 0,
            totalBytes: data.totalBytes || 15 * 1024 * 1024 * 1024,
            percentage: data.percentage || 0
          });
        }
      } catch (err) {
        console.error('Failed to load storage info in sidebar:', err);
      }
    };
    fetchStorage();
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Brand & Nav Links */}
        <div className="flex flex-col flex-1 px-4 py-6 overflow-y-auto">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                <FiCloud className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  {APP_NAME} <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold uppercase">Pro</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Cloud Storage Hub</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Upload Action Box */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100/80 dark:border-blue-900/30">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <FiArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Need more space?</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Upgrade to Enterprise tier</p>
              </div>
            </div>
            <Link
              to="/profile"
              className="mt-3 block w-full text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Bottom Section: Storage Progress Bar Widget */}
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiHardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Storage</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{storage.percentage}%</span>
          </div>
          
          {/* Storage Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                storage.percentage > 85 ? 'bg-rose-500' : storage.percentage > 65 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(storage.percentage, 100)}%` }}
            />
          </div>
          
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>{formatFileSize(storage.usedBytes)} used</span>
            <span>of {formatFileSize(storage.totalBytes)}</span>
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
