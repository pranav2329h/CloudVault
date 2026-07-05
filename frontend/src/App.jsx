import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Loader from './components/common/Loader';

// Layouts (loaded synchronously for immediate layout shell rendering)
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages (Lazy loaded for production code splitting & performance optimization)
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Files = React.lazy(() => import('./pages/Files'));
const Upload = React.lazy(() => import('./pages/Upload'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2)',
              fontSize: '13px',
              fontWeight: '500',
              padding: '12px 16px'
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#FFFFFF'
              }
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF'
              }
            }
          }}
        />

        {/* Routing Structure with Suspense Code Splitting */}
        <Suspense fallback={<Loader fullScreen={true} text="Loading workspace..." />}>
          <Routes>
            {/* Root redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public Authentication Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/files" element={<Files />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
