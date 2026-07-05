import React from 'react';
import { formatCurrency } from '../utils/currency';

import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-screen-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <Link to="/Course" className="bg-pink-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-pink-600 transition-colors">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {cart.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 last:border-0">
                    
                    {/* Image & Title */}
                    <div className="flex items-center w-full sm:w-2/5 mb-4 sm:mb-0">
                      <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded shadow-sm" />
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
                        <p className="text-pink-500 font-bold">{formatCurrency(item.price || 0)}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center w-full sm:w-1/5 mb-4 sm:mb-0">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-4 font-semibold text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-center w-full sm:w-1/5 mb-4 sm:mb-0">
                      <span className="font-bold text-gray-900 text-lg">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end w-full sm:w-1/5">
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 font-semibold px-4 py-2 rounded border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="font-semibold text-gray-600">Total:</span>
                  <span className="font-extrabold text-pink-600 text-2xl">{formatCurrency(totalPrice)}</span>
                </div>
                <button 
                  onClick={() => navigate('/Checkout')}
                  className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
