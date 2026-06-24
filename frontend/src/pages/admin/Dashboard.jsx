import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch summary numbers on component mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/admin/summary');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve dashboard stats summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="h-60 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs mt-3">Loading stats summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time statistics summary of your e-commerce operations</p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-lg relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-violet-600 rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Total Revenue
          </p>
          <p className="text-3xl font-extrabold text-white">
            ${stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="text-[10px] text-slate-500 mt-2 font-medium">All completed transactions</div>
        </div>

        {/* Total Orders Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-lg relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-600 rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Total Orders
          </p>
          <p className="text-3xl font-extrabold text-white">
            {stats?.totalOrders}
          </p>
          <div className="text-[10px] text-slate-500 mt-2 font-medium">Paid and pending shipments</div>
        </div>

        {/* Total Products Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-lg relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-600 rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Total Products
          </p>
          <p className="text-3xl font-extrabold text-white">
            {stats?.totalProducts}
          </p>
          <div className="text-[10px] text-slate-500 mt-2 font-medium">Active items in catalog</div>
        </div>

        {/* Total Users Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-lg relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-600 rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Total Users
          </p>
          <p className="text-3xl font-extrabold text-white">
            {stats?.totalUsers}
          </p>
          <div className="text-[10px] text-slate-500 mt-2 font-medium">Registered account holders</div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
