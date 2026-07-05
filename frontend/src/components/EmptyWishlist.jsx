import React from 'react';
import { Link } from 'react-router-dom';

const EmptyWishlist = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="w-24 h-24 bg-pink-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <svg className="w-12 h-12 text-pink-400 dark:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Your Wishlist is Empty</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-lg">
        Keep track of books you love by adding them to your wishlist. Let's find your next favorite read!
      </p>
      <Link 
        to="/Course" 
        className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        Browse Books
      </Link>
    </div>
  );
};

export default EmptyWishlist;
