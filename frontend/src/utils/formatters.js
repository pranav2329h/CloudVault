import React from 'react';
import { 
  FiFileText, FiImage, FiVideo, FiMusic, FiArchive, FiFile, FiCode 
} from 'react-icons/fi';
import { FILE_CATEGORIES } from './constants';

/**
 * Formats bytes into a human-readable file size string.
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string} Formatted size (e.g., "4.25 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formats ISO date string into a user-friendly date string.
 * @param {string|Date} dateString 
 * @returns {string} Formatted date (e.g., "Jul 5, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return 'N/A';
  }
};

/**
 * Formats date to a detailed timestamp including time.
 * @param {string|Date} dateString 
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return 'N/A';
  }
};

/**
 * Determines file category based on filename extension.
 * @param {string} fileName 
 * @returns {string} Category name ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'CODE', or 'OTHER')
 */
export const getFileCategory = (fileName) => {
  if (!fileName) return 'OTHER';
  const parts = fileName.split('.');
  if (parts.length < 2) return 'OTHER';
  
  const ext = parts.pop().toLowerCase();
  
  for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
    if (extensions.includes(ext)) {
      return category;
    }
  }
  
  return 'OTHER';
};

/**
 * Returns React icon and color styles based on file category or filename.
 * @param {string} fileName 
 * @returns {Object} { icon: ReactComponent, colorClass: string, bgClass: string }
 */
export const getFileIconProps = (fileName) => {
  const category = getFileCategory(fileName);
  
  switch (category) {
    case 'IMAGE':
      return {
        icon: FiImage,
        colorClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-100 dark:bg-purple-900/30'
      };
    case 'VIDEO':
      return {
        icon: FiVideo,
        colorClass: 'text-pink-600 dark:text-pink-400',
        bgClass: 'bg-pink-100 dark:bg-pink-900/30'
      };
    case 'AUDIO':
      return {
        icon: FiMusic,
        colorClass: 'text-yellow-600 dark:text-yellow-400',
        bgClass: 'bg-yellow-100 dark:bg-yellow-900/30'
      };
    case 'DOCUMENT':
      return {
        icon: FiFileText,
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-100 dark:bg-blue-900/30'
      };
    case 'ARCHIVE':
      return {
        icon: FiArchive,
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-100 dark:bg-amber-900/30'
      };
    case 'CODE':
      return {
        icon: FiCode,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/30'
      };
    default:
      return {
        icon: FiFile,
        colorClass: 'text-slate-600 dark:text-slate-400',
        bgClass: 'bg-slate-100 dark:bg-slate-800'
      };
  }
};

/**
 * Calculates storage percentage.
 * @param {number} used 
 * @param {number} total 
 * @returns {number} Percentage between 0 and 100
 */
export const calculatePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  const pct = (used / total) * 100;
  return Math.min(Math.max(Math.round(pct * 10) / 10, 0), 100);
};
