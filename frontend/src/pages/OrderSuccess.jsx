import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';

const OrderSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No checkout session ID found. Cannot verify order.');
        setLoading(false);
        return;
      }

      try {
        // Contact backend to verify the Stripe session, capture the shipping address, and record the payment
        await api.post('/orders/confirm', { sessionId });
        clearCart();
      } catch (err) {
        console.error('Payment Verification Error:', err);
        setError(err.response?.data?.message || 'Failed to verify transaction with the server.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] flex flex-col justify-between">
      {/* Navigation Header */}
      <Navbar />

      {/* Success Card Body */}
      <main className="max-w-md mx-auto px-6 py-16 flex-grow flex items-center justify-center w-full">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden w-full">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full filter blur-[80px] opacity-10"></div>
          
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-medium">Verifying transaction details...</p>
            </div>
          ) : error ? (
            <div className="py-6">
              {/* Error icon */}
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold mb-3 text-red-400">
                Payment Verification Failed
              </h1>
              
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {error}
              </p>

              <div className="flex justify-center">
                <Link
                  to="/cart"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 text-center w-full"
                >
                  Return to Shopping Cart
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Checkmark icon */}
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                Order Confirmed!
              </h1>
              
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Thank you for your purchase. Your payment was securely processed via Stripe, and your order has been received.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs px-6 py-3 rounded-xl transition-all text-center"
                >
                  View My Orders
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600 mt-12">
        &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default OrderSuccess;
