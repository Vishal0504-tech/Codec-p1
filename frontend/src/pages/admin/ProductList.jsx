import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination & Search States
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        pageNumber: page,
        keyword,
      };
      // Reuse the existing public GET /api/products, which supports keyword & pageNumber
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setPages(data.pages);
      setTotalProducts(data.totalProducts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1); // Reset to first page
  };

  // Delete product action handler
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setSuccess('');
        setError('');
        await api.delete(`/products/${id}`);
        setSuccess(`Product "${name}" deleted successfully.`);
        // Reload products or update local state
        if (products.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchProducts();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete the product.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            Inventory & Products
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, update, and manage your e-commerce product catalog
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-violet-500/20 active:scale-95 self-start sm:self-auto"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add New Product</span>
        </Link>
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

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md flex">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search items by name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-l-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 rounded-r-xl transition-all"
          >
            Search
          </button>
        </form>

        <span className="text-xs sm:text-sm text-slate-500 self-center">
          Found <strong className="text-slate-300">{totalProducts}</strong> products
        </span>
      </div>

      {/* Products table */}
      {loading ? (
        <div className="h-60 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs mt-3">Loading product inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-slate-400 font-medium">No products found in inventory.</p>
          {keyword && (
            <button
              onClick={() => {
                setKeyword('');
                setSearchInput('');
                setPage(1);
              }}
              className="text-violet-400 hover:text-violet-300 font-semibold text-xs mt-2 underline"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Product Info</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6 text-center">Stock</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Thumbnail and Title info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden border border-white/5 flex-shrink-0 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder.jpg';
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">
                              No Pic
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate max-w-xs sm:max-w-md">
                            {product.name}
                          </h4>
                          <span className="text-xs text-slate-400 mt-0.5 inline-block font-medium">
                            Brand: {product.brand || 'Generic'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                        {product.category}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-6 text-right font-semibold text-white">
                      ${product.price?.toFixed(2)}
                    </td>

                    {/* Stock status Column */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block font-semibold text-xs px-2.5 py-1 rounded-full ${
                          product.stock <= 0
                            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                            : product.stock <= 5
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {product.stock <= 0 ? 'Out of Stock' : `${product.stock} units`}
                      </span>
                    </td>

                    {/* Action buttons Column */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500 text-slate-400 hover:text-violet-400 transition-all"
                          title="Edit Product"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.name)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 text-slate-400 hover:text-red-400 transition-all"
                          title="Delete Product"
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination widget inside card footer */}
          {pages > 1 && (
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing Page <strong>{page}</strong> of <strong>{pages}</strong> pages
              </div>
              <div className="flex space-x-1">
                {[...Array(pages).keys()].map((p) => (
                  <button
                    key={p + 1}
                    onClick={() => setPage(p + 1)}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      page === p + 1
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
