import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder, FiHardDrive, FiPieChart, FiUploadCloud, FiArrowRight, FiShield, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useFiles } from '../hooks/useFiles';
import storageService from '../services/storageService';
import { DEFAULT_STORAGE_LIMIT_BYTES } from '../utils/constants';
import StorageCard from '../components/dashboard/StorageCard';
import StoragePieChart from '../components/charts/StoragePieChart';
import RecentUploads from '../components/dashboard/RecentUploads';
import FilePreviewModal from '../components/files/FilePreviewModal';
import ShareModal from '../components/files/ShareModal';
import { formatFileSize } from '../utils/formatters';

export const Dashboard = () => {
  const { user } = useAuth();
  const { files, loading: filesLoading, downloadFile, deleteFile } = useFiles({ limit: 6 });
  const [storageData, setStorageData] = useState({
  totalBytes: DEFAULT_STORAGE_LIMIT_BYTES,
  usedBytes: 0,
  remainingBytes: DEFAULT_STORAGE_LIMIT_BYTES,
  percentage: 0,
  totalFiles: 0,
  categories: {}
});

const [metricsLoading, setMetricsLoading] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState(null);

  const handleOpenPreview = (file) => {
    setSelectedFileForPreview(file);
    setPreviewModalOpen(true);
  };

  const handleOpenShare = (file) => {
    setSelectedFileForShare(file);
    setShareModalOpen(true);
  };

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await storageService.getStorageMetrics();
        if (data) {
          setStorageData(data);
        }
      } catch (err) {
        // Silently handle error or show notification
      } finally {
        setMetricsLoading(false);
      }
    };
    loadMetrics();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <FiShield className="w-3.5 h-3.5" /> AWS S3 Protected Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-blue-100 max-w-xl">
            You are currently using <span className="font-bold text-white">{storageData.percentage}%</span> of your cloud storage. Everything is encrypted and synced across all your devices.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-bold text-sm shadow-lg hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <FiUploadCloud className="w-5 h-5 stroke-[2.5]" />
            <span>Upload New Files</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Cards Grid: Total Files, Storage Used, Remaining Storage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StorageCard
          title="Total Files"
          value={metricsLoading ? '...' : (storageData.totalFiles || files.length || 0)}
          subtitle="Documents, media & archives"
          icon={FiFolder}
          colorScheme="blue"
        />
        <StorageCard
          title="Storage Used"
          value={metricsLoading ? '...' : formatFileSize(storageData.usedBytes)}
          subtitle={`Of ${formatFileSize(storageData.totalBytes)} total limit`}
          icon={FiHardDrive}
          colorScheme="purple"
          progress={storageData.percentage}
        />
        <StorageCard
          title="Remaining Space"
          value={metricsLoading ? '...' : formatFileSize(storageData.remainingBytes)}
          subtitle={`${(100 - storageData.percentage).toFixed(1)}% free capacity`}
          icon={FiPieChart}
          colorScheme="emerald"
          progress={100 - storageData.percentage}
        />
      </div>

      {/* Main Content Grid: Storage Pie Chart & Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Storage Distribution Pie Chart (4 columns on desktop) */}
        <div className="lg:col-span-5 h-full">
          <StoragePieChart
            categories={storageData.categories}
            totalUsed={storageData.usedBytes}
          />
        </div>

        {/* Right: Recent Uploads (7 columns on desktop) */}
        <div className="lg:col-span-7 h-full">
          <RecentUploads
            files={files}
            loading={filesLoading}
            onDownload={downloadFile}
            onDelete={deleteFile}
            onPreview={handleOpenPreview}
            onShare={handleOpenShare}
          />
        </div>
      </div>

      {/* Quick Tips Footer Box */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FiTrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Pro Tip: Drag and drop folders anywhere</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Head over to the Upload page or My Files to drag and drop multiple files simultaneously with instant S3 encryption.</p>
          </div>
        </div>
        <Link
          to="/files"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          Explore All Files <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

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

export default Dashboard;
