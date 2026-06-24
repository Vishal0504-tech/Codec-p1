import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const OrderFailed = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] flex flex-col justify-between">
      {/* Navigation Header */}
      <Navbar />

      {/* Failure Card Body */}
      <main className="max-w-md mx-auto px-6 py-16 flex-grow flex items-center justify-center w-full">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500 rounded-full filter blur-[80px] opacity-10"></div>
          
          {/* Failure X icon */}
          <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 via-rose-200 to-red-400 bg-clip-text text-transparent">
            Payment Aborted
          </h1>
          
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Your payment session was cancelled, timed out, or could not be completed. No charges were made to your account.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cart"
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 text-center"
            >
              Return to Cart
            </Link>
            <Link
              to="/"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs px-6 py-3 rounded-xl transition-all text-center"
            >
              View Products
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600 mt-12">
        &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default OrderFailed;
