import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search files, folders, documents...',
  className = '',
  debounceMs = 300
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange && searchTerm !== value) {
        onChange(searchTerm);
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs, onChange, value]);

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <FiSearch className="absolute left-3.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          aria-label="Clear search"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
