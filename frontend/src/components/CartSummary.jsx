import React from 'react';
import { formatCurrency } from '../utils/currency';

import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const shippingCost = 5.00; // Flat rate shipping
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-300">
        <div className="flex justify-between items-center">
          <span>Items ({totalItems}):</span>
          <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping:</span>
          <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(shippingCost)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mb-6">
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-gray-900 dark:text-white">Grand Total:</span>
          <span className="font-extrabold text-pink-600 dark:text-pink-400 text-2xl">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/Checkout')} // Will create this later
        className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-pink-600 hover:shadow-lg transition-all active:scale-95 mb-3"
      >
        Proceed to Checkout
      </button>
      
      <p className="text-xs text-center text-gray-400 dark:text-gray-500">
        Taxes calculated at checkout. Secure SSL encrypted payment.
      </p>
    </div>
  );
};

export default CartSummary;
