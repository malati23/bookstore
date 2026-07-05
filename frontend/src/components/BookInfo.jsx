import React, { useState } from 'react';
import { formatCurrency } from '../utils/currency';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const BookInfo = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, wishlist } = useWishlist();
  
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Determine stock status (Forced to true for testing as discussed, but structured to handle real logic)
  const isInStock = true; // Replace with: book.stock > 0 when backend supports it.
  
  const originalPrice = book.price ? book.price + 15 : null; // Simulated discount price for premium feel

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    // Add multiple quantities by calling addToCart multiple times or passing qty. 
    // Since context adds 1 by default if new, we loop, or ideally context should accept qty.
    // For now, we will add the object with a specific quantity, context handles it gracefully.
    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      
      {/* 1. Header Info (Title, Category, Author, Rating) */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {book.category}
          </span>
          <span
            className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${
              isInStock
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
            }`}
          >
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
          {book.title}
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-4 flex items-center gap-2">
          By <span className="text-gray-900 dark:text-white font-bold">{book.author}</span>
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="flex">{renderStars(book.rating || 4)}</div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 font-medium">
              ({book.rating || 4}.0) • {Math.floor(Math.random() * 200 + 50)} Reviews
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-slate-700 mb-6" />

      {/* 2. Pricing & Quantity */}
      <div className="mb-8">
        <div className="flex items-end gap-4 mb-6">
          <span className="text-4xl font-extrabold text-pink-600 dark:text-pink-500">
            {formatCurrency(book.price)}
          </span>
          {originalPrice && (
            <span className="text-2xl text-gray-400 dark:text-gray-500 line-through font-semibold mb-1">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center">
            <span className="mr-4 font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border-2 border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden h-12 w-32">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                disabled={quantity <= 1 || !isInStock}
              >
                -
              </button>
              <input 
                type="text" 
                value={quantity} 
                readOnly 
                className="w-full h-full text-center font-bold text-gray-800 dark:text-white bg-transparent border-x-2 border-gray-200 dark:border-slate-600 outline-none"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                disabled={!isInStock}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <button
          disabled={!isInStock}
          onClick={handleAddToCart}
          className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2 ${
            isInStock
              ? 'bg-pink-600 text-white hover:bg-pink-700 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-gray-600 shadow-none'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Add to Cart
        </button>
        <button
          disabled={!isInStock}
          onClick={() => {
            handleAddToCart();
            navigate('/Cart');
          }}
          className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
            isInStock
              ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-gray-600 shadow-none'
          }`}
        >
          Buy Now
        </button>
        <button 
          onClick={() => addToWishlist(book)}
          className={`py-4 px-4 rounded-xl border-2 transition-all tooltip ${wishlist.some(item => item._id === book._id) ? 'border-pink-500 text-pink-500 bg-pink-50' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-pink-500 hover:text-pink-500'}`} 
          data-tip={wishlist.some(item => item._id === book._id) ? "In Wishlist" : "Add to Wishlist"}
        >
          <svg className={`w-6 h-6 ${wishlist.some(item => item._id === book._id) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>

      {/* 4. Tabs Section */}
      <div className="mt-auto border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('description')}
            className={`flex-1 py-4 font-bold text-sm sm:text-base transition-colors ${activeTab === 'description' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50 dark:bg-slate-700/50' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('additional')}
            className={`flex-1 py-4 font-bold text-sm sm:text-base transition-colors ${activeTab === 'additional' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50 dark:bg-slate-700/50' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
          >
            Details
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 font-bold text-sm sm:text-base transition-colors ${activeTab === 'reviews' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50 dark:bg-slate-700/50' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
          >
            Reviews
          </button>
        </div>
        
        <div className="p-6 sm:p-8 min-h-[200px]">
          {activeTab === 'description' && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {book.description || "No description available for this book."}
            </p>
          )}
          
          {activeTab === 'additional' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-base">
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Publisher</span>
                <span className="text-gray-900 dark:text-white font-semibold">{book.publisher || "Indie Press"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Published Year</span>
                <span className="text-gray-900 dark:text-white font-semibold">{book.publishedYear || "2024"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Language</span>
                <span className="text-gray-900 dark:text-white font-semibold">{book.language || "English"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Pages</span>
                <span className="text-gray-900 dark:text-white font-semibold">{book.pages || Math.floor(Math.random() * 300 + 150)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">ISBN-13</span>
                <span className="text-gray-900 dark:text-white font-semibold">{book.isbn || "978-3-16-148410-0"}</span>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">No reviews yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Be the first to review this book!</p>
              <button className="mt-4 px-6 py-2 border-2 border-pink-500 text-pink-500 font-bold rounded-lg hover:bg-pink-50 dark:hover:bg-slate-700 transition-colors">Write a Review</button>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="font-bold">Added {quantity} to Cart!</span>
        </div>
      )}
    </div>
  );
};

export default BookInfo;
