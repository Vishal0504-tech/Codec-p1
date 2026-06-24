import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Helper to render star rating symbols based on score (out of 5)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-amber-400 text-sm">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="text-amber-400 text-sm">★</span>);
      } else {
        stars.push(<span key={i} className="text-slate-600 text-sm">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between">
      {/* Product Image Container */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-slate-900/50 aspect-video">
        <img
          src={product.images && product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-violet-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
          {product.category}
        </span>
      </Link>

      {/* Product Details info body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div>
          {/* Brand Name */}
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          
          {/* Product Title */}
          <Link
            to={`/product/${product._id}`}
            className="block text-slate-200 font-semibold text-lg line-clamp-1 hover:text-violet-400 transition-colors"
          >
            {product.name}
          </Link>
          
          {/* Description Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Ratings and Reviews counts */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-0.5">{renderStars(product.ratings)}</div>
          <span className="text-xs text-slate-500">({product.numReviews})</span>
        </div>

        {/* Price & Add to Cart footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xl font-bold text-white">${product.price}</span>
          <Link
            to={`/product/${product._id}`}
            className="bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
