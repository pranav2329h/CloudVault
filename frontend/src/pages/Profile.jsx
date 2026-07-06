import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogOut, FiSave, FiMail, FiCheck, FiShield, FiHardDrive } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import profileService from '../services/profileService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateUserData, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'general';
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const navigate = useNavigate();

  // Profile edit form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    }
  });

  // Password change form
  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passErrors }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const newPassVal = watch('newPassword', '');

  const onUpdateProfile = async (data) => {
    setLoadingProfile(true);
    try {
      const result = await profileService.updateProfile(data);
      if (result.user) {
        updateUserData(result.user);
      } else {
        updateUserData({ ...user, ...data });
      }
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoadingPassword(true);
    try {
      await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Top Banner Profile Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name || 'User'}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30 shadow-lg shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{user?.name || 'User'}</h1>
              <Badge variant="primary" size="sm">{user?.role || 'user'}</Badge>
            </div>
            <p className="text-sm text-slate-300 flex items-center gap-1.5">
              <FiMail className="w-3.5 h-3.5 text-blue-400" /> {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end relative z-10">
          <Button
            variant="danger"
            icon={FiLogOut}
            onClick={handleLogout}
            className="w-full md:w-auto shadow-md shadow-rose-500/20"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation Tabs */}
        <div className="md:col-span-4 space-y-2">
          <Card className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'general' })}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'general'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FiUser className="w-4 h-4" />
              <span>General Settings</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'security' })}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FiLock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'plan' })}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'plan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FiHardDrive className="w-4 h-4" />
              <span>Subscription & Storage</span>
            </button>
          </Card>
        </div>

        {/* Tab Content Area */}
        <div className="md:col-span-8">
          {activeTab === 'general' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Profile Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your account identity and email address.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...regProfile('name', { required: 'Name is required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-xs text-rose-500">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...regProfile('email', { required: 'Email is required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-xs text-rose-500">{profileErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    {...regProfile('avatar')}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" loading={loadingProfile} icon={FiSave}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Change Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...regPassword('currentPassword', { required: 'Current password is required' })}
                    placeholder="********"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {passErrors.currentPassword && (
                    <p className="mt-1 text-xs text-rose-500">{passErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...regPassword('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    placeholder="********"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {passErrors.newPassword && (
                    <p className="mt-1 text-xs text-rose-500">{passErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...regPassword('confirmNewPassword', {
                      required: 'Please confirm your new password',
                      validate: (val) => val === newPassVal || 'Passwords do not match'
                    })}
                    placeholder="********"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {passErrors.confirmNewPassword && (
                    <p className="mt-1 text-xs text-rose-500">{passErrors.confirmNewPassword.message}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" loading={loadingPassword} icon={FiCheck}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'plan' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Storage Plan Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You are currently subscribed to the CloudVault Pro Tier.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-blue-900 dark:text-blue-100">Pro Tier Plan ($12/month)</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Includes 15 GB of encrypted AWS S3 cloud storage, priority uploads, and file sharing.
                  </p>
                </div>
                <Badge variant="primary" size="lg">ACTIVE</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Storage Used</span>
                  <span>8.45 GB of 15.00 GB (56.3%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '56.3%' }} />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline">Manage Billing</Button>
                <Button variant="primary">Upgrade to 1 TB ($29/mo)</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
