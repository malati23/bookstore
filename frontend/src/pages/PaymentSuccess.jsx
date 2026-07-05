import React, { useEffect } from 'react';
import { formatCurrency } from '../utils/currency';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // Add 5 days

  const [showToast, setShowToast] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans relative">
      <Navebar />
      
      {showToast && (
        <div className="fixed top-24 right-8 px-6 py-3 rounded-lg shadow-lg font-bold z-50 animate-fade-in-down bg-green-500 text-white">
          Payment Successful! Order Confirmed.
        </div>
      )}
      
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-16">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-gray-100 text-center max-w-lg w-full relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-12 h-12 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Thank you for your purchase. Your payment was processed securely. 
            We are preparing your order for shipment.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200 text-left text-sm space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Transaction ID:</span>
              <span className="font-mono font-bold text-gray-800">{order?.transactionId || 'TXN-' + Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Order Reference:</span>
              <span className="font-mono font-bold text-gray-800">#{order?._id?.substring(0,8).toUpperCase() || 'ORD-987654'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Customer Name:</span>
              <span className="font-bold text-gray-800">{order?.customerName || 'Guest'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Payment Method:</span>
              <span className="font-bold text-gray-800">{order?.paymentMethod || 'Unknown'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Payment Status:</span>
              <span className="font-bold text-green-600">{order?.paymentStatus || 'Paid'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Total Amount:</span>
              <span className="font-bold text-pink-600">{formatCurrency(order?.totalAmount || 0)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500 font-semibold flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Est. Delivery:</span>
              <span className="font-bold text-gray-900">{estimatedDelivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link 
              to="/Course" 
              className="flex-1 bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Continue Shopping
            </Link>
            
            <Link 
              to="/Orders" 
              className="flex-1 bg-gray-100 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all border border-gray-200 active:scale-95"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
