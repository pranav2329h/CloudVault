import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiLock, FiAlertCircle, FiFile, FiShield, FiCheckCircle } from 'react-icons/fi';
import fileService from '../services/fileService';
import Loader from '../components/common/Loader';
import { formatFileSize, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export const SharedFileView = () => {
  const { shareToken } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchShared = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fileService.getSharedFile(shareToken);
        if (active) {
          setFile(data);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'This file is restricted, no longer shared, or the link has expired.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (shareToken) {
      fetchShared();
    }

    return () => {
      active = false;
    };
  }, [shareToken]);

  const handleDownload = async () => {
    if (!file) return;
    setDownloading(true);
    const toastId = toast.loading(`Starting download for "${file.name}"...`);
    try {
      await fileService.downloadSharedFile(shareToken, file.name);
      toast.success('Download completed!', { id: toastId });
    } catch (err) {
      toast.error('Failed to download file', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between font-sans transition-colors">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <FiShield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
            CloudVault
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {loading ? (
          <div className="py-20 text-center">
            <Loader size="lg" text="Verifying secure link and loading file..." />
          </div>
        ) : error || !file ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <FiLock className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Access Restricted
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {error || 'This file is either private or the share link has expired.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-block w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm shadow-lg transition-all"
              >
                Go to CloudVault Homepage
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          >
            {/* Top Banner */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                  <FiFile className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-1">
                    {file.category || 'FILE'}
                  </span>
                  <h1 className="text-base sm:text-lg font-black truncate tracking-tight">
                    {file.name}
                  </h1>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <div className="text-xs font-semibold opacity-90">{formatFileSize(file.size)}</div>
                <div className="text-[10px] opacity-75">{formatDate(file.updatedAt)}</div>
              </div>
            </div>

            {/* File Details & Download Area */}
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-8 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <FiCheckCircle className="w-3.5 h-3.5" /> End-to-End Encrypted Public Share
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  You have been invited to view and download this file via CloudVault. Click the download button below to save it securely to your device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                <FiDownload className="w-5 h-5 stroke-[2.5]" />
                {downloading ? 'Downloading...' : 'Download File'}
              </button>
            </div>

            {/* Footer Note */}
            <div className="px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Hosted securely by CloudVault Pro</span>
              <span className="font-mono">ID: {file.id?.slice(-8)}</span>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
        © {new Date().getFullYear()} CloudVault Pro. All rights reserved. Secure Cloud Storage System.
      </footer>
    </div>
  );
};

export default SharedFileView;
