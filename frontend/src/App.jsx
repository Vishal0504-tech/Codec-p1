import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import useAuth from './hooks/useAuth.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import { CartProvider } from './context/CartContext.jsx';
import CartPage from './pages/CartPage.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import OrderFailed from './pages/OrderFailed.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import ProductList from './pages/admin/ProductList.jsx';
import ProductForm from './pages/admin/ProductForm.jsx';
import OrderList from './pages/admin/OrderList.jsx';
import UserList from './pages/admin/UserList.jsx';

// A simple premium Dashboard UI to show once users log in successfully.
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]">
      {/* Premium Navbar */}
      <header className="border-b border-white/10 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              E-Commerce Client
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400 hidden sm:inline">
              Logged in as: <strong className="text-violet-400">{user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden max-w-lg">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-500 rounded-full filter blur-[80px] opacity-10"></div>
          
          {/* User Icon/Avatar */}
          <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20 text-3xl font-bold text-white uppercase">
            {user?.name?.substring(0, 2)}
          </div>

          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-300 to-indigo-200 bg-clip-text text-transparent">
            Authentication Secured!
          </h1>
          
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You are successfully logged in using your JSON Web Token. The session token is securely cached in local storage.
          </p>

          {/* User details table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Database ID:</span>
              <span className="font-mono text-slate-300 text-right truncate max-w-[180px]">{user?._id}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Email Address:</span>
              <span className="text-slate-300 text-right">{user?.email}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Account Role:</span>
              <span className="capitalize px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
};

// Main routing container
const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Catalog Routes */}
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout-success" element={<OrderSuccess />} />
            <Route path="/checkout-failed" element={<OrderFailed />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Require JWT login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin Routes (Require Admin role & layout sidebar) */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/:id/edit" element={<ProductForm />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/users" element={<UserList />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
