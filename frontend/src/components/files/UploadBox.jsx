import React, { useState, useCallback } from 'react';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle, FiAlertCircle, FiArrowUp } from 'react-icons/fi';
import Button from '../common/Button';
import { formatFileSize, getFileIconProps } from '../../utils/formatters';

export const UploadBox = ({ onUpload, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => ({
        file: f,
        id: 'file-' + Math.random().toString(36).substring(2, 9),
        progress: 0,
        status: 'pending' // pending | uploading | success | error
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        file: f,
        id: 'file-' + Math.random().toString(36).substring(2, 9),
        progress: 0,
        status: 'pending'
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(item => item.id !== id));
  };

  const startUpload = async () => {
    if (selectedFiles.length === 0 || !onUpload) return;
    setUploading(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const current = selectedFiles[i];
      if (current.status === 'success') continue;

      setSelectedFiles(prev =>
        prev.map(item => item.id === current.id ? { ...item, status: 'uploading' } : item)
      );

      try {
        await onUpload(current.file, (progressPct) => {
          setSelectedFiles(prev =>
            prev.map(item => item.id === current.id ? { ...item, progress: progressPct } : item)
          );
        });

        setSelectedFiles(prev =>
          prev.map(item => item.id === current.id ? { ...item, status: 'success', progress: 100 } : item)
        );
      } catch (error) {
        setSelectedFiles(prev =>
          prev.map(item => item.id === current.id ? { ...item, status: 'error' } : item)
        );
      }
    }

    setUploading(false);
  };

  const pendingCount = selectedFiles.filter(f => f.status !== 'success').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 scale-[1.01] shadow-lg'
            : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FiUploadCloud className="w-8 h-8 stroke-[2]" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Drag and drop files here
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Support for documents, images, videos, archives and code up to 500 MB per file.
        </p>

        <label className="inline-flex items-center justify-center font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-[0.98]">
          <FiArrowUp className="w-4 h-4 mr-2" />
          <span>Browse Device Files</span>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Selected Files List & Progress Bars */}
      {selectedFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Selected Files ({selectedFiles.length})
            </h4>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {selectedFiles.map((item) => {
              const { icon: Icon, colorClass, bgClass } = getFileIconProps(item.file.name);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.file.name}
                        </p>
                        <span className="text-xs text-slate-400 font-medium shrink-0">
                          {formatFileSize(item.file.size)}
                        </span>
                      </div>

                      {/* Progress Bar for each file */}
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mt-2">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            item.status === 'success'
                              ? 'bg-emerald-500'
                              : item.status === 'error'
                              ? 'bg-rose-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator / Remove Button */}
                  <div className="shrink-0 flex items-center">
                    {item.status === 'success' && (
                      <span className="text-emerald-500 flex items-center gap-1 text-xs font-semibold" title="Uploaded">
                        <FiCheckCircle className="w-4 h-4" /> Done
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-rose-500 flex items-center gap-1 text-xs font-semibold" title="Failed">
                        <FiAlertCircle className="w-4 h-4" /> Error
                      </span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                        {item.progress}%
                      </span>
                    )}
                    {item.status === 'pending' && !uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        title="Remove file"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          {pendingCount > 0 && (
            <div className="pt-3 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                loading={uploading}
                onClick={startUpload}
                icon={FiUploadCloud}
                className="font-bold shadow-md shadow-blue-600/20"
              >
                {uploading ? 'Uploading files to AWS S3...' : `Upload ${pendingCount} File${pendingCount > 1 ? 's' : ''}`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadBox;
