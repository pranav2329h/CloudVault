import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600' : '';

  const mergedClasses = twMerge(clsx(baseClasses, hoverClasses, padding, className));

  return (
    <div className={mergedClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
