import { 
  FiGrid, FiFolder, FiUploadCloud, FiUser, 
  FiFileText, FiImage, FiVideo, FiMusic, FiArchive, FiFile, FiCode 
} from 'react-icons/fi';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CloudVault';
export const API_BASE_URL =import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const DEFAULT_STORAGE_LIMIT_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB default

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'My Files', path: '/files', icon: FiFolder },
  { name: 'Upload Files', path: '/upload', icon: FiUploadCloud },
  { name: 'Profile', path: '/profile', icon: FiUser },
];

export const FILE_CATEGORIES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'],
  VIDEO: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'],
  AUDIO: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'md'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
  CODE: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp', 'sql', 'sh']
};

export const COLOR_PALETTE = {
  primary: '#2563EB',
  secondary: '#1E40AF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  backgroundLight: '#F8FAFC',
  backgroundDark: '#0F172A',
  cardLight: '#FFFFFF',
  cardDark: '#1E293B'
};

export const STORAGE_KEYS = {
  TOKEN: 'cloudvault_access_token',
  USER: 'cloudvault_user_data',
  THEME: 'cloudvault_theme_mode'
};
