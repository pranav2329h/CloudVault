import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiShare2, FiFileText, FiMusic, FiAlertCircle } from 'react-icons/fi';
import fileService from '../../services/fileService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

export const FilePreviewModal = ({
  isOpen,
  onClose,
  file,
  onDownload,
  onShare
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);

  useEffect(() => {
    let active = true;
    let url = null;

    const loadPreview = async () => {
      if (!isOpen || !file) return;
      setLoading(true);
      setError(null);
      setBlobUrl(null);
      setTextContent(null);

      try {
        const blob = await fileService.getFileBlob(file);
        if (!active) return;

        url = URL.createObjectURL(blob);
        setBlobUrl(url);

        // Check if text/code file
        const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
        const textExts = ['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'json', 'py', 'html', 'css', 'sql', 'csv', 'sh', 'yaml', 'yml', 'xml'];
        if (textExts.includes(ext) || blob.type.startsWith('text/')) {
          try {
            const text = await blob.text();
            if (active) setTextContent(text);
          } catch (e) {
            // ignore text reading error
          }
        }
      } catch (err) {
        if (active) {
          setError('Could not load file preview. Please try downloading the file.');
          toast.error('Failed to load file preview');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPreview();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const isPdf = file.name?.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
  const isImage = file.category === 'IMAGE' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(file.name?.split('.').pop().toLowerCase());
  const isVideo = file.category === 'VIDEO' || ['mp4', 'mov', 'webm', 'ogg', 'mkv'].includes(file.name?.split('.').pop().toLowerCase());
  const isAudio = file.category === 'AUDIO' || ['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(file.name?.split('.').pop().toLowerCase());

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                {file.category || 'FILE'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                {file.name}
              </h3>
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

          {/* Modal Body */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-[300px] bg-slate-100/50 dark:bg-slate-950/50">
            {loading ? (
              <Loader size="md" text="Loading secure file preview..." />
            ) : error ? (
              <div className="flex flex-col items-center text-center py-12 gap-3 text-rose-500">
                <FiAlertCircle className="w-12 h-12 stroke-[1.5]" />
                <p className="font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-md">{error}</p>
                {onDownload && (
                  <button
                    type="button"
                    onClick={() => onDownload(file)}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
                  >
                    <FiDownload className="w-4 h-4" /> Download Instead
                  </button>
                )}
              </div>
            ) : blobUrl ? (
              <div className="w-full flex items-center justify-center">
                {isImage ? (
                  <img
                    src={blobUrl}
                    alt={file.name}
                    className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-800"
                  />
                ) : isVideo ? (
                  <video
                    src={blobUrl}
                    controls
                    autoPlay
                    className="max-h-[65vh] max-w-full rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-800"
                  />
                ) : isAudio ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-6 w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-500 shadow-inner">
                      <FiMusic className="w-10 h-10 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate max-w-[250px]">{file.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">Audio Recording</p>
                    </div>
                    <audio src={blobUrl} controls className="w-full" />
                  </div>
                ) : isPdf ? (
                  <iframe
                    src={blobUrl}
                    title={file.name}
                    className="w-full h-[65vh] border-0 rounded-2xl shadow-inner bg-white"
                  />
                ) : textContent !== null ? (
                  <pre className="w-full max-h-[65vh] overflow-auto bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed shadow-xl border border-slate-800 text-left">
                    <code>{textContent}</code>
                  </pre>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                      <FiFileText className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{file.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        This document format cannot be previewed directly in your browser.
                      </p>
                    </div>
                    {onDownload && (
                      <button
                        type="button"
                        onClick={() => onDownload(file)}
                        className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all"
                      >
                        <FiDownload className="w-4 h-4" /> Download File
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              {onShare && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onShare(file);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <FiShare2 className="w-4 h-4" /> Share Link
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              {onDownload && (
                <button
                  type="button"
                  onClick={() => onDownload(file)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <FiDownload className="w-4 h-4" /> Download
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FilePreviewModal;
