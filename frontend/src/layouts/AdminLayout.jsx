import React from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If session state is still loading, render a centered loading screen.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Role-Based Access Control (RBAC) Guard:
  // If the user object is null, or the user's role is not "admin", abort and redirect to home catalog page.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Active route checking helper for sidebar highlights
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]">
      
      {/* Sidebar Navigation Panel */}
      <aside className="w-full md:w-64 backdrop-blur-xl bg-white/5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between flex-shrink-0">
        <div className="p-6">
          
          {/* Dashboard Title */}
          <div className="mb-8 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Admin Portal
            </h2>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
              Control Panel
            </p>
          </div>

          {/* Links Nav Grid */}
          <nav className="space-y-2">
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/admin')
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/products"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/admin/products')
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Manage Products</span>
            </Link>

            <Link
              to="/admin/orders"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/admin/orders')
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Manage Orders</span>
            </Link>

            <Link
              to="/admin/users"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/admin/users')
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Manage Users</span>
            </Link>
          </nav>
        </div>

        {/* Back to store navigation redirect */}
        <div className="p-6 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl text-xs transition-all"
          >
            <span>Back to Store Catalog</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area (Render child routes inside Outlet) */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
