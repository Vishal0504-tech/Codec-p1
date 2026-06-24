import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Navbar from '../components/Navbar.jsx';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State hooks
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // List of product categories we support in the filter drop-down
  const categoriesList = ['All', 'Electronics', 'Furniture', 'Appliances', 'Footwear', 'Accessories'];

  // Trigger the fetch call whenever page, keyword, category, or price limits change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Build query string params
        const params = {
          pageNumber: page,
          keyword,
          category,
          minPrice: minPrice || 0,
          maxPrice: maxPrice || Infinity,
        };

        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setPages(data.pages);
        setTotalProducts(data.totalProducts);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve products catalog.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, keyword, category, minPrice, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1); // Reset to page 1 on new search
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setSearchInput('');
    setKeyword('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] flex flex-col justify-between">
      {/* Global Navbar Component */}
      <Navbar />

      {/* Main product feed layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow flex flex-col lg:flex-row gap-8">
        
        {/* Filters Panel sidebar (Double column layout helper) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-white/5 pb-2">
              Filters
            </h3>

            <div className="space-y-5">
              {/* Category Dropdown Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range input fields */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Price Limit ($)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="Min"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-slate-600">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Max"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Clear filters Button */}
              <button
                onClick={clearFilters}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-medium py-2 rounded-lg transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Product listing center grid */}
        <section className="flex-grow flex flex-col justify-between">
          
          {/* Search bar row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-grow max-w-lg flex">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products by title..."
                className="w-full bg-slate-900 border border-slate-800 rounded-l-lg py-2 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-6 rounded-r-lg transition-all"
              >
                Search
              </button>
            </form>

            <span className="text-xs sm:text-sm text-slate-500">
              Found <strong className="text-slate-300">{totalProducts}</strong> products
            </span>
          </div>

          {/* Catalog grid body */}
          {loading ? (
            // Loading State Spinner
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs mt-4">Loading catalog items...</p>
            </div>
          ) : error ? (
            // Error Feedback Banner
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center py-10">
              {error}
            </div>
          ) : products.length === 0 ? (
            // Empty Catalog State
            <div className="text-center py-20 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-slate-400 font-medium">No products match your filters.</p>
              <button
                onClick={clearFilters}
                className="text-violet-400 hover:text-violet-300 font-semibold text-xs mt-2 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            // Product Catalog Grid Layout
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination buttons section */}
          {!loading && pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12 border-t border-white/5 pt-6">
              {[...Array(pages).keys()].map((p) => (
                <button
                  key={p + 1}
                  onClick={() => setPage(p + 1)}
                  className={`w-9 h-9 rounded-lg font-medium text-xs transition-all border ${
                    page === p + 1
                      ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {p + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600 mt-12">
        &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductsPage;
