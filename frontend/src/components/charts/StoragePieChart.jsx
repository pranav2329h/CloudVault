import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from '../common/Card';
import { formatFileSize } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

export const StoragePieChart = ({ categories, totalUsed }) => {
  if (!categories || Object.keys(categories).length === 0) {
    return (
      <Card className="flex items-center justify-center h-80 text-slate-400">
        No storage metrics available
      </Card>
    );
  }

  const labels = Object.values(categories).map(c => c.label || 'Other');
  const dataValues = Object.values(categories).map(c => c.bytes || 0);
  const colors = Object.values(categories).map(c => c.color || '#3B82F6');

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 13, family: 'Inter', weight: 'bold' },
        bodyFont: { size: 12, family: 'Inter' },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const pct = totalUsed ? ((value / totalUsed) * 100).toFixed(1) : 0;
            return ` ${label}: ${formatFileSize(value)} (${pct}%)`;
          }
        }
      }
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Storage Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Breakdown of your AWS S3 bucket usage by file category
        </p>
      </div>

      <div className="relative h-56 flex items-center justify-center my-2">
        <Doughnut data={data} options={options} />
        {/* Center Label inside Doughnut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
            {formatFileSize(totalUsed || 0)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Used
          </span>
        </div>
      </div>

      {/* Custom Clean SaaS Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: cat.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{cat.label}</p>
              <p className="text-[10px] text-slate-400">{formatFileSize(cat.bytes)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StoragePieChart;
