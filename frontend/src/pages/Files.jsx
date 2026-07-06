import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFiles } from '../hooks/useFiles';
import FileCard from '../components/files/FileCard';
import FileRow from '../components/files/FileRow';
import FileFilters from '../components/files/FileFilters';
import RenameModal from '../components/files/RenameModal';
import FilePreviewModal from '../components/files/FilePreviewModal';
import ShareModal from '../components/files/ShareModal';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';

export const Files = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const {
    files,
    loading,
    pagination,
    params,
    updateParams,
    renameFile,
    deleteFile,
    downloadFile
  } = useFiles({ search: initialSearch });

  const [viewMode, setViewMode] = useState('grid');
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedFileForRename, setSelectedFileForRename] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState(null);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    if (query !== params.search) {
      updateParams({ search: query, page: 1 });
    }
  }, [searchParams, params.search, updateParams]);

  const handleOpenRename = (file) => {
    setSelectedFileForRename(file);
    setRenameModalOpen(true);
  };

  const handleOpenPreview = (file) => {
    setSelectedFileForPreview(file);
    setPreviewModalOpen(true);
  };

  const handleOpenShare = (file) => {
    setSelectedFileForShare(file);
    setShareModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      updateParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <FiFolder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span>My Files</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, organize, and share all your cloud documents stored securely in AWS S3.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          Showing {files.length} of {pagination.total || files.length} files
        </div>
      </div>

      {/* Filter and View Controls Toolbar */}
      <FileFilters
        params={params}
        onParamsChange={updateParams}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {/* Main Files Display */}
      {loading ? (
        <div className="py-20">
          <Loader size="lg" text="Fetching your files from CloudVault..." />
        </div>
      ) : files.length === 0 ? (
        <EmptyState
          title="No files found"
          description="We couldn't find any files matching your search or category filters. Try resetting your search query or uploading new files."
          actionLabel="Reset Filters"
          onAction={() => updateParams({ search: '', category: 'ALL', page: 1 })}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={downloadFile}
              onRename={handleOpenRename}
              onDelete={deleteFile}
              onPreview={handleOpenPreview}
              onShare={handleOpenShare}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-hidden p-0 animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Size</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Modified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    onDownload={downloadFile}
                    onRename={handleOpenRename}
                    onDelete={deleteFile}
                    onPreview={handleOpenPreview}
                    onShare={handleOpenShare}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-slate-800 text-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page <strong className="text-slate-800 dark:text-slate-200">{pagination.page}</strong> of <strong className="text-slate-800 dark:text-slate-200">{pagination.totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              aria-label="Previous page"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              aria-label="Next page"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        file={selectedFileForRename}
        onRename={renameFile}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        file={selectedFileForPreview}
        onDownload={downloadFile}
        onShare={handleOpenShare}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        file={selectedFileForShare}
        onShareUpdated={(updated) => {
          if (selectedFileForPreview && selectedFileForPreview.id === updated.id) {
            setSelectedFileForPreview(updated);
          }
        }}
      />
    </motion.div>
  );
};

export default Files;
