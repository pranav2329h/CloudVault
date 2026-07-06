import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import SearchBar from '../common/SearchBar';
import toast from 'react-hot-toast';

export const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to CloudVault Pro!', time: 'Just now', read: false },
    { id: 2, title: 'Storage limit increased to 15 GB', time: '1 hr ago', read: false },
    { id: 3, title: 'Project Design System.fig shared with you', time: 'Yesterday', read: true }
  ]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/files?search=${encodeURIComponent(query.trim())}`);
    } else if (location.pathname === '/files') {
      navigate('/files');
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Left section: Mobile menu button & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block w-full">
          <SearchBar placeholder="Search files, folders, or docs..." onChange={handleSearch} />
        </div>
      </div>

      {/* Right section: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FiSun className="w-5 h-5 text-amber-400" /> : <FiMoon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <FiCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-3 ${!n.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 opacity-80" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="User profile menu"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="hidden md:flex flex-col text-left mr-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight max-w-[100px] truncate">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {user?.role || 'user'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 md:hidden">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
              >
                <FiUser className="w-4 h-4 text-slate-400" /> My Profile
              </Link>
              <Link
                to="/profile?tab=security"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
              >
                <FiSettings className="w-4 h-4 text-slate-400" /> Account Settings
              </Link>
              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-full text-left transition-colors font-medium"
              >
                <FiLogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
