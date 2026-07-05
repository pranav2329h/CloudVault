import React, { useState } from 'react';
import { FiDownload, FiEdit2, FiTrash2, FiExternalLink, FiStar, FiMoreVertical } from 'react-icons/fi';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatFileSize, formatDate, getFileIconProps } from '../../utils/formatters';

export const FileCard = ({ file, onDownload, onRename, onDelete, onPreview }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { icon: Icon, colorClass, bgClass } = getFileIconProps(file.name);

  return (
    <Card
      hover={true}
      className="flex flex-col justify-between h-full relative group p-5 transition-all"
    >
      {/* Top Header: Star badge & Options dropdown */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Badge variant="default" size="sm">
            {file.category || 'FILE'}
          </Badge>
          {file.starred && (
            <span className="text-amber-400" title="Starred">
              <FiStar className="w-4 h-4 fill-amber-400" />
            </span>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="File actions"
          >
            <FiMoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                {file.url && file.url !== '#' && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors w-full text-left"
                  >
                    <FiExternalLink className="w-3.5 h-3.5 text-slate-400" /> Preview
                  </a>
                )}
                {onDownload && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDownload(file);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors w-full text-left"
                  >
                    <FiDownload className="w-3.5 h-3.5 text-slate-400" /> Download
                  </button>
                )}
                {onRename && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onRename(file);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors w-full text-left"
                  >
                    <FiEdit2 className="w-3.5 h-3.5 text-slate-400" /> Rename
                  </button>
                )}
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(file.id, file.name);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors w-full text-left font-medium"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle Center Icon / Thumbnail preview */}
      <div
        onClick={() => onPreview ? onPreview(file) : (file.url && file.url !== '#' && window.open(file.url, '_blank'))}
        className="flex flex-col items-center justify-center py-6 my-2 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 cursor-pointer group-hover:scale-[1.02] transition-transform"
      >
        <div className={`w-14 h-14 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center mb-2 shadow-inner`}>
          <Icon className="w-7 h-7 stroke-[2]" />
        </div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 px-3 text-center truncate max-w-full">
          {file.name}
        </p>
      </div>

      {/* Bottom Footer Info & Quick Hover Actions */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
        <span>{formatFileSize(file.size)}</span>
        <span>{formatDate(file.updatedAt)}</span>
      </div>
    </Card>
  );
};

export default FileCard;
