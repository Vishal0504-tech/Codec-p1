import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15; // Free shipping over $150
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError('');

      // 1. Create the pending order in our database first (shipping address will be updated after Stripe checkout)
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image || (item.images ? item.images[0] : ''),
          price: item.price,
          product: item._id,
        })),
        shippingAddress: {
          address: 'Pending Stripe Checkout',
          city: 'Pending',
          postalCode: 'Pending',
          country: 'Pending',
        },
        paymentMethod: 'Stripe',
        totalPrice: total,
      };

      const orderResponse = await api.post('/orders', orderPayload);
      const createdOrder = orderResponse.data;

      if (!createdOrder || !createdOrder._id) {
        throw new Error('Failed to save a pending order in the database.');
      }

      // 2. Send the cart items and the created order ID to our backend payment router
      const { data } = await api.post('/payment/create-checkout-session', {
        cartItems: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.images ? item.images[0] : item.image,
        })),
        orderId: createdOrder._id,
      });

      // Redirect the customer's browser window to Stripe's hosted checkout screen
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError('Payment gateway URL not received.');
      }
    } catch (err) {
      console.error(err);
      setCheckoutError(err.response?.data?.message || err.message || 'Failed to initialize payment gateway.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] flex flex-col justify-between">
      {/* Navigation Header */}
      <Navbar />

      {/* Cart Content body */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        {checkoutError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {checkoutError}
          </div>
        )}

        {cartItems.length === 0 ? (
          // Empty Cart UI
          <div className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-16 h-16 text-slate-600 mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <p className="text-slate-400 font-medium text-lg">Your shopping cart is currently empty.</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart review grid columns
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left side: Items list column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 transition-all duration-300 hover:border-white/15"
                >
                  {/* Photo & title */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={item.images ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-900 border border-white/5"
                    />
                    <div>
                      <Link
                        to={`/product/${item._id}`}
                        className="text-slate-200 font-semibold hover:text-violet-400 text-sm sm:text-base line-clamp-1 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">Brand: {item.brand}</p>
                      <p className="text-violet-400 font-bold text-sm mt-1 sm:hidden">
                        ${item.price}
                      </p>
                    </div>
                  </div>

                  {/* Pricing, Quantity & Remove actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    {/* Price on tablet/desktop */}
                    <span className="text-slate-200 font-bold hidden sm:inline text-lg">
                      ${item.price}
                    </span>

                    {/* Quantity selectors */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Qty:</span>
                      <select
                        value={item.qty}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                      >
                        {[...Array(item.stock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-all"
                      title="Remove Item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0M4.5 18v3h15v-3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Calculations subtotal box */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-slate-200 border-b border-white/5 pb-2">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-slate-200 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sales Tax (8%):</span>
                  <span className="text-slate-200 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping Fees:</span>
                  <span className="text-slate-200 font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-slate-500 text-right">
                    Add ${(150 - subtotal).toFixed(2)} more for Free Shipping!
                  </p>
                )}
                
                <div className="flex justify-between border-t border-white/5 pt-4 text-base font-bold">
                  <span className="text-slate-200">Total Price:</span>
                  <span className="text-violet-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 flex items-center justify-center text-sm"
              >
                {checkoutLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  user ? 'Proceed to Checkout' : 'Sign In to Checkout'
                )}
              </button>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600 mt-12">
        &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default CartPage;
