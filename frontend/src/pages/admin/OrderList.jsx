import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Keeps track of which order ID is currently expanded to show details
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      // GET /api/admin/orders
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (id) => {
    try {
      setSuccess('');
      setError('');
      // PUT /api/admin/orders/:id/deliver
      const { data } = await api.put(`/admin/orders/${id}/deliver`);
      setSuccess(`Order #${id.substring(19)} marked as delivered successfully.`);
      
      // Update local list state
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === id ? { ...o, isDelivered: true, deliveredAt: data.deliveredAt } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const toggleExpandOrder = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          Order Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track payments, review purchases, and mark delivery dispatch updates
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

      {/* Main orders feed */}
      {loading ? (
        <div className="h-60 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs mt-3">Loading customer order feed...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-slate-400 font-medium">No customer orders found in the database.</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Total Price</th>
                  <th className="py-4 px-6 text-center">Paid</th>
                  <th className="py-4 px-6 text-center">Delivered</th>
                  <th className="py-4 px-6 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      {/* Order ID Code */}
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-300">
                        #{order._id.substring(18)}
                      </td>

                      {/* Customer credentials */}
                      <td className="py-4 px-6">
                        <div className="min-w-0">
                          <p className="font-bold text-white">
                            {order.user?.name || 'Deleted Account'}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {order.user?.email || 'N/A'}
                          </p>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-xs text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Total cost */}
                      <td className="py-4 px-6 text-right font-semibold text-white">
                        ${order.totalPrice?.toFixed(2)}
                      </td>

                      {/* Paid status check */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block font-semibold text-[10px] uppercase px-2.5 py-1 rounded-full ${
                            order.isPaid
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/10 border border-red-500/20 text-red-400'
                          }`}
                        >
                          {order.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                        {order.isPaid && order.paidAt && (
                          <span className="block text-[9px] text-slate-500 mt-1">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </td>

                      {/* Delivered status check */}
                      <td className="py-4 px-6 text-center">
                        {order.isDelivered ? (
                          <div>
                            <span className="inline-block font-semibold text-[10px] uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              Delivered
                            </span>
                            {order.deliveredAt && (
                              <span className="block text-[9px] text-slate-500 mt-1">
                                {new Date(order.deliveredAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="inline-block font-semibold text-[10px] uppercase px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
                              Processing
                            </span>
                            {order.isPaid && (
                              <button
                                onClick={() => handleDeliver(order._id)}
                                className="text-[10px] bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded font-semibold transition-all"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Toggle detail drawer action */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => toggleExpandOrder(order._id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs font-semibold flex items-center space-x-1 mx-auto"
                        >
                          <span>{expandedOrderId === order._id ? 'Hide' : 'Items'}</span>
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              expandedOrderId === order._id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* Detailed drawer row (Accordion layout) */}
                    {expandedOrderId === order._id && (
                      <tr className="bg-slate-950/40">
                        <td colSpan="7" className="py-4 px-8 border-b border-white/5">
                          <div className="space-y-4">
                            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Order Summary & Shipping Address
                            </h5>

                            {/* Shipping details info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
                              <div>
                                <p className="text-slate-500">Destination:</p>
                                <p className="font-medium text-slate-300 mt-0.5">
                                  {order.shippingAddress?.address}
                                </p>
                                <p className="font-medium text-slate-300">
                                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                </p>
                                <p className="font-medium text-slate-300">
                                  {order.shippingAddress?.country}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500">Billing details:</p>
                                <p className="font-medium text-slate-300 mt-0.5">
                                  Method: <strong className="text-slate-200">{order.paymentMethod}</strong>
                                </p>
                                {order.paymentResult?.id && (
                                  <p className="font-mono text-[10px] text-slate-500">
                                    Txn ID: {order.paymentResult.id}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Purchased Items table */}
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-500">Items Purchased:</p>
                              <div className="divide-y divide-white/5">
                                {order.orderItems?.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between py-2 text-xs"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded bg-slate-900 overflow-hidden border border-white/5 flex-shrink-0 flex items-center justify-center">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/placeholder.jpg';
                                          }}
                                        />
                                      </div>
                                      <span className="font-medium text-slate-200 max-w-xs truncate">
                                        {item.name}
                                      </span>
                                    </div>
                                    <div className="text-slate-400">
                                      {item.qty} &times; ${item.price?.toFixed(2)} ={' '}
                                      <strong className="text-white">
                                        ${(item.qty * item.price)?.toFixed(2)}
                                      </strong>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
