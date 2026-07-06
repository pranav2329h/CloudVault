import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShare2, FiLock, FiGlobe, FiCopy, FiCheck, FiShield, FiLink } from 'react-icons/fi';
import fileService from '../../services/fileService';
import toast from 'react-hot-toast';

export const ShareModal = ({
  isOpen,
  onClose,
  file,
  onShareUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState('private');
  const [shareToken, setShareToken] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      setAccess(file.shared && file.shareAccess === 'public' ? 'public' : 'private');
      setShareToken(file.shareToken || null);
      setCopied(false);
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const handleAccessChange = async (newAccess) => {
    setLoading(true);
    try {
      const updated = await fileService.updateShareSettings(file.id, {
        shared: newAccess === 'public',
        shareAccess: newAccess
      });
      setAccess(newAccess);
      if (updated?.shareToken) {
        setShareToken(updated.shareToken);
      }
      if (onShareUpdated) {
        onShareUpdated(updated);
      }
      toast.success(newAccess === 'public' ? 'Link sharing turned on' : 'File restricted');
    } catch (err) {
      toast.error('Failed to update share settings');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : `${window.location.origin}/share/pending...`;

  const handleCopyLink = () => {
    if (!shareToken) {
      // Turn on sharing first if restricted
      handleAccessChange('public').then(() => {
        if (shareToken) {
          navigator.clipboard.writeText(`${window.location.origin}/share/${shareToken}`);
          setCopied(true);
          toast.success('Share link copied to clipboard!');
          setTimeout(() => setCopied(false), 3000);
        }
      });
      return;
    }

    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                <FiShare2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  Share File
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px]">
                  {file.name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* General Access Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                General Access
              </label>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                {/* Restricted Option */}
                <div
                  onClick={() => !loading && handleAccessChange('private')}
                  className={`flex items-start gap-3.5 p-3 rounded-xl cursor-pointer transition-all ${
                    access === 'private'
                      ? 'bg-white dark:bg-slate-800 shadow-sm border border-blue-500/30'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-700/50 opacity-70'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    access === 'private' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <FiLock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Restricted</span>
                      {access === 'private' && (
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Only people with account access can open with link.
                    </p>
                  </div>
                </div>

                {/* Anyone with the link Option */}
                <div
                  onClick={() => !loading && handleAccessChange('public')}
                  className={`flex items-start gap-3.5 p-3 rounded-xl cursor-pointer transition-all ${
                    access === 'public'
                      ? 'bg-white dark:bg-slate-800 shadow-sm border border-indigo-500/30'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-700/50 opacity-70'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    access === 'public' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <FiGlobe className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Anyone with the link</span>
                      {access === 'public' && (
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Anyone on the internet with the link can view and download.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Link Preview & Copy */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Share Link
              </label>
              <div className="flex items-center gap-2 p-1.5 pl-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FiLink className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={access === 'public' && shareToken ? shareUrl : 'Turn on "Anyone with the link" to generate shareable URL'}
                  className="bg-transparent text-xs text-slate-600 dark:text-slate-300 w-full focus:outline-none font-mono select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={loading}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 stroke-[3]" /> Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FiShield className="w-4 h-4 text-emerald-500" /> End-to-End Encrypted Link
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-sm transition-colors shadow-md"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;
