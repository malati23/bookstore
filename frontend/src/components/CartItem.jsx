import React from 'react';
import { formatCurrency } from '../utils/currency';

import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
      
      {/* Product Image & Info */}
      <div className="flex items-center w-full sm:w-1/2 mb-4 sm:mb-0">
        <Link to={`/books/${item._id}`} className="shrink-0">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-20 h-24 object-cover rounded-md shadow-sm border border-gray-100 dark:border-slate-600 hover:opacity-80 transition-opacity"
          />
        </Link>
        <div className="ml-4 flex-grow">
          <Link to={`/books/${item._id}`}>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 hover:text-pink-500 transition-colors">
              {item.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">by {item.author}</p>
          <span className="text-pink-500 font-bold">{formatCurrency(item.price)}</span>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between w-full sm:w-1/2">
        {/* Quantity Controls */}
        <div className="flex items-center bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
          <button 
            onClick={() => updateQuantity(item._id, -1)}
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-l-lg transition-colors font-bold"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="px-4 font-semibold text-gray-800 dark:text-white border-l border-r border-gray-200 dark:border-slate-600">
            {item.quantity}
          </span>
          <button 
            onClick={() => updateQuantity(item._id, 1)}
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-r-lg transition-colors font-bold"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div className="hidden md:block w-24 text-right">
          <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>

        {/* Remove Button */}
        <button 
          onClick={() => removeFromCart(item._id)}
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-slate-700 transition-colors tooltip"
          data-tip="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>

    </div>
  );
};

export default CartItem;
