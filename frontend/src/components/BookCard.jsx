import React from 'react';
import { formatCurrency } from '../utils/currency';

import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  // Determine stock status (Forced to true for testing)
  const isInStock = true;

  // Simple render for stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 dark:border-slate-700 overflow-hidden h-full">
      {/* Image Container with Zoom effect */}
      <div className="relative overflow-hidden h-64 bg-gray-100 dark:bg-slate-900 flex justify-center items-center">
        <img
          src={book.image}
          alt={book.title}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {book.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title and Author */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
          by {book.author}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">{renderStars(book.rating || 0)}</div>
          <span className="text-xs text-gray-500 ml-2">({book.rating || 0})</span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-grow">
          {book.description}
        </p>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-5">
          <span className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">
            {formatCurrency(book.price)}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              isInStock
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-auto">
          <Link
            to={`/books/${book._id || book.id}`}
            className="flex-1 text-center bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            View Details
          </Link>
          <button
            disabled={!isInStock}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              isInStock
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-slate-600 dark:text-gray-400'
            }`}
            onClick={() => {
              addToCart(book);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
