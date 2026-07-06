import React from 'react';
import { FiDownload, FiEdit2, FiTrash2, FiExternalLink, FiStar, FiShare2 } from 'react-icons/fi';
import Badge from '../common/Badge';
import { formatFileSize, formatDate, getFileIconProps } from '../../utils/formatters';

export const FileRow = ({ file, onDownload, onRename, onDelete, onPreview, onShare }) => {
  const { icon: Icon, colorClass, bgClass } = getFileIconProps(file.name);

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
      {/* File Name & Icon */}
      <td className="py-3.5 px-4 text-left">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
            <Icon className="w-4.5 h-4.5 stroke-[2]" />
          </div>
          <div className="min-w-0 flex-1">
            <span
              onClick={() => onPreview ? onPreview(file) : (file.url && file.url !== '#' && window.open(file.url, '_blank'))}
              className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors block truncate"
            >
              {file.name}
            </span>
            <span className="text-[11px] text-slate-400 sm:hidden block mt-0.5">
              {formatFileSize(file.size)} • {formatDate(file.updatedAt)}
            </span>
          </div>
          {file.starred && (
            <span className="text-amber-400 shrink-0" title="Starred">
              <FiStar className="w-3.5 h-3.5 fill-amber-400" />
            </span>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-4 text-left hidden md:table-cell whitespace-nowrap">
        <Badge variant="default" size="sm">
          {file.category || 'FILE'}
        </Badge>
      </td>

      {/* File Size */}
      <td className="py-3.5 px-4 text-left hidden sm:table-cell text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {formatFileSize(file.size)}
      </td>

      {/* Date Modified */}
      <td className="py-3.5 px-4 text-left hidden lg:table-cell text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(file.updatedAt)}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(file)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
              title="Preview file"
            >
              <FiExternalLink className="w-4 h-4" />
            </button>
          )}
          {onShare && (
            <button
              type="button"
              onClick={() => onShare(file)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              title="Share link / access"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              title="Download file"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          )}
          {onRename && (
            <button
              type="button"
              onClick={() => onRename(file)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
              title="Rename file"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(file.id, file.name)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
              title="Delete file"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default FileRow;
