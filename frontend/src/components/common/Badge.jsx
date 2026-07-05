import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full uppercase tracking-wider';

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
    success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50',
    warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50',
    danger: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const mergedClasses = twMerge(
    clsx(baseClasses, variantClasses[variant] || variantClasses.default, sizeClasses[size] || sizeClasses.md, className)
  );

  return (
    <span className={mergedClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
