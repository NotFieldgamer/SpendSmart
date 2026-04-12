// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Wraps any route requiring authentication.
 * - While initial auth check is running → full-screen spinner (no flash)
 * - No token / user → redirect to /login (remembers intended URL)
 * - Authenticated → render children
 */
export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return <LoadingSpinner fullscreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
