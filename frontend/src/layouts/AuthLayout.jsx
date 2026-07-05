import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiCloud, FiCheckCircle } from 'react-icons/fi';
import { APP_NAME } from '../utils/constants';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative gradient background blobs for Glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-600/30 to-pink-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        {/* Left column: SaaS Product Showcase (Desktop Only / Tablet) */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 flex-col justify-between h-full pr-6 lg:pr-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <FiCloud className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {APP_NAME} <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold uppercase tracking-wider border border-blue-500/30">Pro</span>
              </span>
            </Link>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Secure, lightning-fast cloud storage for modern teams.
            </h1>
            <p className="text-slate-300 text-base lg:text-lg mb-8 leading-relaxed max-w-lg">
              Store, preview, share, and manage your documents with enterprise-grade AWS S3 encryption and seamless collaboration tools.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">JWT-based secure API authentication</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Advanced drag-and-drop AWS S3 uploads</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Real-time storage analytics & custom charts</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} {APP_NAME} Inc.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>

        {/* Right column: Glassmorphic Outlet for Login / Register Form */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5">
          <div className="w-full rounded-3xl p-8 sm:p-10 bg-slate-800/60 backdrop-blur-2xl border border-slate-700/80 shadow-2xl relative">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
