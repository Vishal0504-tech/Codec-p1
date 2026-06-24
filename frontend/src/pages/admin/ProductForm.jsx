import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Electronics',
    brand: '',
    stock: '',
    images: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // List of standard categories
  const categoriesList = ['Electronics', 'Furniture', 'Appliances', 'Footwear', 'Accessories'];

  // If in edit mode, fetch product details on load
  useEffect(() => {
    if (isEditMode) {
      const fetchProductDetails = async () => {
        try {
          setFetchingProduct(true);
          setError('');
          const { data } = await api.get(`/products/${id}`);
          setFormData({
            name: data.name || '',
            price: data.price !== undefined ? data.price.toString() : '',
            description: data.description || '',
            category: data.category || 'Electronics',
            brand: data.brand || '',
            stock: data.stock !== undefined ? data.stock.toString() : '',
            // Convert array of image URLs back to comma-separated text
            images: data.images ? data.images.join(', ') : '',
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to retrieve product details.');
        } finally {
          setFetchingProduct(false);
        }
      };
      fetchProductDetails();
    }
  }, [id, isEditMode]);

  // Form validation helper
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required.';
    if (!formData.brand.trim()) errors.brand = 'Brand is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (!formData.category) errors.category = 'Category is required.';

    const priceNum = Number(formData.price);
    if (!formData.price.toString().trim()) {
      errors.price = 'Price is required.';
    } else if (isNaN(priceNum) || priceNum < 0) {
      errors.price = 'Price must be a valid, positive number.';
    }

    const stockNum = Number(formData.stock);
    if (!formData.stock.toString().trim()) {
      errors.stock = 'Stock count is required.';
    } else if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      errors.stock = 'Stock must be a valid, non-negative integer.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when editing field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Split comma-separated URLs and trim whitespace
      const imagesArray = formData.images
        ? formData.images.split(',').map((url) => url.trim()).filter((url) => url !== '')
        : undefined;

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        stock: Number(formData.stock),
        images: imagesArray,
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      // Navigate back to listing page on success
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving the product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="h-60 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs mt-3">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Navigation and title header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all hover:border-slate-700"
          title="Back to inventory"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEditMode
              ? 'Update specifications and stock levels'
              : 'Add a new item to the store catalog'}
          </p>
        </div>
      </div>

      {/* API Errors */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400/60 hover:text-red-400">
            &times;
          </button>
        </div>
      )}

      {/* Main glassmorphic form */}
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* Name input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Mechanical Gaming Keyboard"
            className={`w-full bg-slate-900 border ${
              validationErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
            } rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
          />
          {validationErrors.name && (
            <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.name}</p>
          )}
        </div>

        {/* Double column fields: Brand & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g. Corsair"
              className={`w-full bg-slate-900 border ${
                validationErrors.brand ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
              } rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
            />
            {validationErrors.brand && (
              <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.brand}</p>
            )}
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-colors"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Double column fields: Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Price ($ USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`w-full bg-slate-900 border ${
                validationErrors.price ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
              } rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
            />
            {validationErrors.price && (
              <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.price}</p>
            )}
          </div>

          {/* Stock input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Stock In Inventory <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              className={`w-full bg-slate-900 border ${
                validationErrors.stock ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
              } rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
            />
            {validationErrors.stock && (
              <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.stock}</p>
            )}
          </div>
        </div>

        {/* Images array list field */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Image URLs</span>
            <span className="text-[10px] text-slate-500 capitalize font-medium">
              Separate multiples with commas
            </span>
          </label>
          <textarea
            name="images"
            value={formData.images}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g. https://example.com/keyboard1.jpg, https://example.com/keyboard2.jpg"
            className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
          />
          <p className="text-[11px] text-slate-500">
            Leave blank to fall back on default catalog image placeholders.
          </p>
        </div>

        {/* Description textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            placeholder="Write a clear details specification description of the product features..."
            className={`w-full bg-slate-900 border ${
              validationErrors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
            } rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
          />
          {validationErrors.description && (
            <p className="text-xs text-red-400 font-medium mt-1">{validationErrors.description}</p>
          )}
        </div>

        {/* Action button bar */}
        <div className="flex items-center justify-end space-x-4 border-t border-white/5 pt-6">
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-semibold text-sm transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
