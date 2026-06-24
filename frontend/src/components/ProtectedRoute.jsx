import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

// The ProtectedRoute component inspects our global state.
// If the user is logged in, it allows them to view the sub-components (using <Outlet />).
// If not, it redirects them to the login page.
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // If we are still checking local storage session state, render a centered loading spinner.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If the user object exists, allow navigation. Else, redirect to /login.
  // "replace" removes the previous route from history, preventing users from backing into protected pages.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
