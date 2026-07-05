import React, { useState } from 'react';
import { formatCurrency } from '../utils/currency';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Instead of creating the order here, pass the billing info to the payment page
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/Payment', { 
        state: { 
          billingDetails: formData,
          cartItems: cart,
          totalAmount: totalPrice
        } 
      });
    }, 500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
        <Navebar />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">You need to add items to your cart before checking out.</p>
          <button 
            onClick={() => navigate('/Course')}
            className="bg-pink-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-pink-600 transition-colors"
          >
            Browse Books
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-screen-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Billing Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Billing Details</h2>
              
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Shipping Address</label>
                  <textarea 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Apartment 4B, City, State, Zip"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Your Order</h2>
              
              <div className="max-h-64 overflow-y-auto mb-6 pr-2 space-y-4">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-pink-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all shadow-md hover:shadow-lg disabled:bg-pink-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Proceed to Payment
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
