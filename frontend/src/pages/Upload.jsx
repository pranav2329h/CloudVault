import React from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiShield, FiHelpCircle, FiCheck, FiFolder } from 'react-icons/fi';
import { useFiles } from '../hooks/useFiles';
import UploadBox from '../components/files/UploadBox';
import RecentUploads from '../components/dashboard/RecentUploads';
import Card from '../components/common/Card';

export const Upload = () => {
  const { files, loading, uploadFile, downloadFile, deleteFile } = useFiles({ limit: 5 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <FiUploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span>Upload Files to AWS S3</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fast, secure cloud file uploads with automatic server-side encryption and compression.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50">
          <FiShield className="w-4 h-4" /> 256-bit S3 Encryption Active
        </div>
      </div>

      {/* Upload Dropzone Box */}
      <UploadBox onUpload={uploadFile} />

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            <FiCheck className="w-4 h-4 text-emerald-500" /> Maximum File Size
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Free tier allows up to 500 MB per single file upload. Pro and Enterprise members can upload files up to 10 GB each.
          </p>
        </Card>

        <Card className="bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            <FiFolder className="w-4 h-4 text-blue-500" /> Supported File Formats
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All major formats are supported: Images, Videos, PDF Documents, Office Spreadsheets, ZIP Archives, and Source Code files.
          </p>
        </Card>

        <Card className="bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            <FiHelpCircle className="w-4 h-4 text-purple-500" /> Instant Deduplication
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our storage system automatically checks SHA-256 hashes to prevent duplicate files from consuming your remaining storage quota.
          </p>
        </Card>
      </div>

      {/* Recent Uploads Section */}
      <div className="pt-4">
        <RecentUploads
          files={files}
          loading={loading}
          onDownload={downloadFile}
          onDelete={deleteFile}
        />
      </div>
    </motion.div>
  );
};

export default Upload;
