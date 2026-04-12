// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// ── Lazy-loaded pages ─────────────────────────────────────────────────
const Landing      = lazy(() => import('./pages/Landing'));
const Login        = lazy(() => import('./pages/Login'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Categories   = lazy(() => import('./pages/Categories'));
const Budget       = lazy(() => import('./pages/Budget'));
const Analytics    = lazy(() => import('./pages/Analytics'));
const Settings     = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullscreen />}>
          <Routes>
            {/* ── Public ── */}
            <Route path="/"      element={<Landing />} />
            <Route path="/login" element={<Login />}   />

            {/* ── Protected (require JWT) ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute><Transactions /></ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute><Categories /></ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute><Budget /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Global toast notifications */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
