import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiXCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navebar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-red-100">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiXCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We couldn't process your payment. This could be due to a declined card, insufficient funds, or a network issue. No charges were made.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/Checkout')}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <FiRefreshCw /> Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <FiArrowLeft /> Return Home
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailed;
