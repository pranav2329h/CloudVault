import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: true
    }
  });

  const passwordVal = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      toast.success('Account created! Welcome to CloudVault.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full text-left"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          Create your account
        </h2>
        <p className="text-sm text-slate-300">
          Get started with 15 GB free cloud storage today. No credit card required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              {...register('name', { required: 'Full name is required' })}
              placeholder="Alex Morgan"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border ${
                errors.name ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'
              } rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name.message}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="name@company.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border ${
                errors.email ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'
              } rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' }
              })}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border ${
                errors.password ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'
              } rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordVal || 'Passwords do not match'
              })}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border ${
                errors.confirmPassword ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'
              } rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-300">
            <input
              type="checkbox"
              {...register('agreeTerms', { required: 'You must accept terms' })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900/60 text-blue-600 focus:ring-blue-500 mt-0.5"
            />
            <span>
              I agree to the <a href="#terms" className="text-blue-400 underline">Terms of Service</a> and{' '}
              <a href="#privacy" className="text-blue-400 underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.agreeTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            icon={FiArrowRight}
            iconPosition="right"
            className="w-full font-bold shadow-lg shadow-blue-600/30"
          >
            Create Free Account
          </Button>
        </div>
      </form>

      {/* Footer Switcher */}
      <p className="mt-5 text-center text-xs sm:text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
