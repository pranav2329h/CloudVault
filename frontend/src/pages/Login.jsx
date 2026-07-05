import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: 'alex.morgan@example.com',
      password: 'password123',
      rememberMe: true
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back to CloudVault!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
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
          Sign in to your account
        </h2>
        <p className="text-sm text-slate-300">
          Enter your credentials to access your cloud files and workspaces.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
              className={`w-full pl-10 pr-4 py-3 bg-slate-900/60 border ${
                errors.email ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'
              } rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <a href="#forgot" className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' }
              })}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-3 bg-slate-900/60 border ${
                errors.password ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'
              } rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900/60 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <span>Remember me for 30 days</span>
          </label>
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
            Sign In to Dashboard
          </Button>
        </div>
      </form>

      {/* Demo Credentials Tip Box */}
      <div className="mt-6 p-3.5 rounded-xl bg-slate-900/40 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
        <FiCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Demo Mode Ready:</span> Click "Sign In" directly with default credentials to test the full SaaS interface!
        </div>
      </div>

      {/* Footer Switcher */}
      <p className="mt-6 text-center text-xs sm:text-sm text-slate-400">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
