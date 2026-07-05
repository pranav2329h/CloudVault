import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm hover:shadow-md focus:ring-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md focus:ring-emerald-500',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-md focus:ring-amber-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md focus:ring-rose-500',
    outline: 'border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-blue-500',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:ring-slate-400'
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  const mergedClasses = twMerge(
    clsx(
      baseClasses,
      variantClasses[variant] || variantClasses.primary,
      sizeClasses[size] || sizeClasses.md,
      className
    )
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={mergedClasses}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 mr-1.5 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
