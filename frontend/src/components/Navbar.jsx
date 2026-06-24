import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useCart from '../hooks/useCart.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  // Calculate the total quantity of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="border-b border-white/10 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand/Logo Link */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent flex items-center space-x-2">
          <span>E-Commerce Store</span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-6">
          
          {/* Shopping Cart Icon & Item Count Badge */}
          <Link to="/cart" className="relative group p-2 rounded-lg hover:bg-white/5 transition-all">
            {/* SVG Shopping Cart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            
            {/* Red count badge (Only render if there are items in the cart) */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-600 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-slate-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Sign-In/Profile dashboard Controls */}
          <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 text-violet-400 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Welcome, <strong className="text-violet-400">{user.name}</strong>
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
