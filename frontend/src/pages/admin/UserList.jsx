import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import useAuth from '../../hooks/useAuth.js';

const UserList = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      // GET /api/admin/users
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user accounts list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    // Safety check in frontend
    if (id === currentAdmin?._id) {
      setError('You cannot delete your own admin account while logged in.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the user account for "${name}"?`)) {
      try {
        setSuccess('');
        setError('');
        // DELETE /api/admin/users/:id
        await api.delete(`/admin/users/${id}`);
        setSuccess(`User account "${name}" removed successfully.`);
        
        // Remove from local list state
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          User Account Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review registered store user accounts and manage customer access
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-emerald-400/60 hover:text-emerald-400">
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400/60 hover:text-red-400">
            &times;
          </button>
        </div>
      )}

      {/* Users table */}
      {loading ? (
        <div className="h-60 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs mt-3">Loading registered accounts...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-slate-400 font-medium">No user records found in the database.</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6 text-center">Role</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {users.map((userRecord) => {
                  const isSelf = userRecord._id === currentAdmin?._id;
                  const isAdmin = userRecord.role === 'admin';

                  return (
                    <tr key={userRecord._id} className="hover:bg-white/[0.01] transition-colors">
                      {/* User ID */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        #{userRecord._id.substring(18)}
                      </td>

                      {/* Name */}
                      <td className="py-4 px-6 font-bold text-white">
                        {userRecord.name}
                        {isSelf && (
                          <span className="ml-2 text-[9px] bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-300">
                        {userRecord.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block font-semibold text-[10px] uppercase px-2.5 py-1 rounded-full ${
                            isAdmin
                              ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {userRecord.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(userRecord.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        {isAdmin ? (
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center space-x-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            <span>Protected</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(userRecord._id, userRecord.name)}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 text-slate-400 hover:text-red-400 transition-all inline-flex items-center"
                            title="Delete User Account"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
