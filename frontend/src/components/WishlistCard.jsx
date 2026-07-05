import React, { useState } from 'react';
import { formatCurrency } from '../utils/currency';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const WishlistCard = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  
  const [showToast, setShowToast] = useState(false);

  // Default to in stock since the backend schema isn't fully configured
  const isInStock = true;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  const handleMoveToCart = () => {
    addToCart(book);
    removeFromWishlist(book._id);
    
    // Optional: show a mini toast locally before it disappears
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const fallbackImage = 'https://via.placeholder.com/500x700?text=No+Cover+Available';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col h-full group overflow-hidden relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 inset-x-4 bg-green-500 text-white text-xs font-bold py-2 rounded-lg text-center shadow-lg z-20 animate-fade-in-down">
          Moved to Cart!
        </div>
      )}

      {/* Image Section */}
      <div className="relative p-6 flex justify-center items-center bg-gray-50 dark:bg-slate-800/50 cursor-pointer overflow-hidden h-64" onClick={() => navigate(`/books/${book._id}`)}>
        <img 
          src={book.image} 
          alt={book.title} 
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
        
        {/* Remove Button (Floating Top Right) */}
        <button 
          onClick={(e) => { e.stopPropagation(); removeFromWishlist(book._id); }}
          className="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm z-10"
          title="Remove from Wishlist"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider bg-pink-50 dark:bg-slate-700 px-2 py-1 rounded">
            {book.category}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${isInStock ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <h3 
          className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 cursor-pointer hover:text-pink-600 transition-colors"
          onClick={() => navigate(`/books/${book._id}`)}
        >
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">By {book.author}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex mr-2">{renderStars(book.rating || 4)}</div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({book.rating || 4}.0)</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-6 flex-grow">
          {book.description || "A captivating book that deserves a spot in your collection."}
        </p>

        {/* Pricing and Actions */}
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-4">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(book.price)}</span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/books/${book._id}`)}
              className="flex-1 py-2.5 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-pink-500 hover:text-pink-500 transition-colors active:scale-95"
            >
              Details
            </button>
            <button 
              disabled={!isInStock}
              onClick={handleMoveToCart}
              className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 ${
                isInStock 
                  ? 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Move
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
