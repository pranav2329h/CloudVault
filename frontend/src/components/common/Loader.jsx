import React from 'react';

export const Loader = ({ size = 'md', fullScreen = false, text = 'Loading CloudVault...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-blue-600 dark:border-blue-500 border-t-transparent dark:border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && (
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
