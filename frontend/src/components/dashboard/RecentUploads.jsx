import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDownload, FiTrash2, FiExternalLink, FiShare2 } from 'react-icons/fi';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatFileSize, formatDate, getFileIconProps } from '../../utils/formatters';

export const RecentUploads = ({ files = [], loading = false, onDownload, onDelete, onPreview, onShare }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Recent Uploads
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your latest files uploaded to CloudVault
          </p>
        </div>
        <Link
          to="/files"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-400 text-sm animate-pulse">
          Loading recent files...
        </div>
      ) : files.length === 0 ? (
        <EmptyState
          title="No recent uploads"
          description="You haven't uploaded any files recently. Drag and drop files to get started."
          className="my-2 py-8"
        />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 -my-2 overflow-x-auto">
          {files.map((file) => {
            const { icon: Icon, colorClass, bgClass } = getFileIconProps(file.name);
            return (
              <div
                key={file.id}
                className="py-3.5 flex items-center justify-between gap-4 group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 px-2 rounded-xl transition-colors"
              >
                {/* Icon & Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onPreview ? onPreview(file) : null}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {formatDate(file.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="hidden sm:block">
                  <Badge variant="primary" size="sm">
                    {file.category || 'FILE'}
                  </Badge>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {onDownload && (
                    <button
                      type="button"
                      onClick={() => onDownload(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      title="Download file"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  )}
                  {onPreview && (
                    <button
                      type="button"
                      onClick={() => onPreview(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      title="Preview file"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  {onShare && (
                    <button
                      type="button"
                      onClick={() => onShare(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      title="Share link / access"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(file.id, file.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                      title="Delete file"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentUploads;
