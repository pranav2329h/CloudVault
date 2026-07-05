import React from 'react';
import Card from '../common/Card';

export const StorageCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'blue',
  progress,
  onClick
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-blue-600'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      bar: 'bg-purple-600'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-rose-500'
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <Card hover={true} onClick={onClick} className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center shadow-inner shrink-0`}>
            <Icon className="w-6 h-6 stroke-[2]" />
          </div>
        )}
      </div>

      <div>
        {typeof progress === 'number' && (
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden my-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scheme.bar}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StorageCard;
