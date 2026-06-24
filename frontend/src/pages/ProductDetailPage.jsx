import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import useCart from '../hooks/useCart.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  const { addToCart } = useCart();

  // Fetch single product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch recommendations on mount or product change
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const { data } = await api.get(`/products/${id}/recommendations`);
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setSuccessMsg('Product added to your cart successfully!');
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-amber-400 text-base">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="text-amber-400 text-base">★</span>);
      } else {
        stars.push(<span key={i} className="text-slate-600 text-base">☆</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs mt-4">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl text-center">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <Link
            to="/"
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] flex flex-col justify-between">
      {/* Global Navbar Component */}
      <Navbar />

      {/* Product Details Wrapper container */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-grow w-full">
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Product Image */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-4 overflow-hidden shadow-2xl">
              <img
                src={product.images && product.images[0]}
                alt={product.name}
                className="w-full h-auto rounded-2xl object-cover aspect-video md:aspect-square"
              />
            </div>

            {/* Right Column: Descriptions & Metadata */}
            <div className="space-y-6">
              <div>
                {/* Brand & Category badges */}
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    {product.brand}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                  <span className="text-xs text-violet-400 font-medium">
                    {product.category}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* Review metrics */}
              <div className="flex items-center space-x-3">
                <div className="flex space-x-0.5">{renderStars(product.ratings)}</div>
                <span className="text-sm text-slate-400">
                  {product.ratings.toFixed(1)} / 5
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-xs text-slate-500">
                  {product.numReviews} Verified Customer Reviews
                </span>
              </div>

              {/* Price Row */}
              <div className="text-3xl font-extrabold text-white">
                ${product.price}
              </div>

              {/* Description */}
              <div className="border-t border-b border-white/5 py-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Purchase Section options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-slate-500">Inventory Status:</span>
                  {product.stock > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs">
                      In Stock ({product.stock} items left)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-xs">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity selector dropdown */}
                {product.stock > 0 && (
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-slate-500">Quantity:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-violet-500"
                    >
                      {[...Array(product.stock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Success Alert */}
                {successMsg && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center md:max-w-xs animate-fade-in">
                    {successMsg}
                  </div>
                )}

                {/* Add to Cart button trigger */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full md:max-w-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                  {product.stock > 0 ? 'Add to Shopping Cart' : 'Temporarily Out of Stock'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Recommended Products Section */}
        {product && (
          <div className="mt-20 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-violet-300 via-indigo-200 to-indigo-300 bg-clip-text text-transparent">
              Customers Also Bought
            </h2>

            {recommendationsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <p className="text-slate-500 text-sm">No recommendations available at this time.</p>
            ) : (
              <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {recommendations.map((recProduct) => (
                  <div key={recProduct._id} className="min-w-[280px] max-w-[290px] flex-shrink-0">
                    <ProductCard product={recProduct} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer bar */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600 mt-12">
        &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductDetailPage;
