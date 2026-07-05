import React from 'react';
import { Button } from './Button';
import { FiFolderPlus } from 'react-icons/fi';

export const EmptyState = ({
  title = 'No files found',
  description = 'There are no files matching your criteria or you have not uploaded anything yet.',
  icon: Icon = FiFolderPlus,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 my-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700/80 max-w-2xl mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
