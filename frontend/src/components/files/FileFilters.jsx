import React from 'react';
import { FiGrid, FiList, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import SearchBar from '../common/SearchBar';

export const FileFilters = ({
  params,
  onParamsChange,
  viewMode = 'grid',
  onViewChange
}) => {
  const categories = [
    { id: 'ALL', label: 'All Files' },
    { id: 'DOCUMENT', label: 'Documents' },
    { id: 'IMAGE', label: 'Images' },
    { id: 'VIDEO', label: 'Videos' },
    { id: 'AUDIO', label: 'Audio' },
    { id: 'ARCHIVE', label: 'Archives' },
    { id: 'CODE', label: 'Code' }
  ];

  const sortOptions = [
    { value: 'updatedAt', label: 'Date Modified' },
    { value: 'name', label: 'File Name' },
    { value: 'size', label: 'File Size' }
  ];

  const handleCategoryChange = (catId) => {
    onParamsChange({ category: catId, page: 1 });
  };

  const handleSortChange = (e) => {
    onParamsChange({ sort: e.target.value });
  };

  const toggleSortOrder = () => {
    onParamsChange({ order: params.order === 'asc' ? 'desc' : 'asc' });
  };

  const handleSearch = (query) => {
    onParamsChange({ search: query, page: 1 });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Bar: Search input & View mode switchers */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={params.search || ''}
            onChange={handleSearch}
            placeholder="Search files by keyword or title..."
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Sorting controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <span className="text-slate-400 pl-2 hidden sm:inline">Sort:</span>
            <select
              value={params.sort || 'updatedAt'}
              onChange={handleSortChange}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 py-1 pr-6 pl-1.5 focus:outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleSortOrder}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
              title={`Toggle sort order (${params.order === 'asc' ? 'Ascending' : 'Descending'})`}
            >
              {params.order === 'asc' ? <FiArrowUp className="w-3.5 h-3.5" /> : <FiArrowDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Grid vs Table View Mode Toggles */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        <FiFilter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block mr-1" />
        {categories.map((cat) => {
          const isActive = (params.category || 'ALL') === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FileFilters;
