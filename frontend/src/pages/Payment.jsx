import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';

import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiBriefcase, FiUploadCloud, FiCopy, FiCheckCircle } from 'react-icons/fi';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';
import { useCart } from '../hooks/useCart';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states for manual payments
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    if (!state?.billingDetails) {
      navigate('/Checkout');
    }
  }, [state, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result); // Save as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const submitOrder = async (paymentData) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: state.billingDetails.fullName,
        customerEmail: state.billingDetails.email,
        phoneNumber: state.billingDetails.phone,
        shippingAddress: state.billingDetails.address,
        totalAmount: state.totalAmount,
        books: state.cartItems.map(item => ({
          bookId: item._id,
          title: item.title || item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price
        })),
        ...paymentData
      };

      // Retrieve logged-in user if exists
      const userStr = localStorage.getItem('Users');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj._id) orderPayload.userId = userObj._id;
        } catch (e) {}
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderPayload);
      clearCart();
      
      if (paymentData.paymentStatus === 'Failed') {
        navigate('/PaymentFailed');
      } else if (paymentData.paymentStatus === 'Paid') {
        navigate('/PaymentSuccess', { state: { order: response.data } });
      } else {
        navigate('/OrderSuccess', { state: { order: response.data } });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      showToast('Failed to process order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (selectedMethod === 'cod') {
      submitOrder({
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Order Placed',
        transactionId: '',
        screenshotUrl: ''
      });
    } else if (selectedMethod === 'upi') {
      if (!transactionId && !screenshotUrl) {
        showToast('Please provide Transaction ID or upload screenshot.', 'error');
        return;
      }
      submitOrder({
        paymentMethod: 'UPI',
        paymentStatus: 'Verification Pending',
        orderStatus: 'Order Placed',
        transactionId: transactionId,
        screenshotUrl: screenshotUrl
      });
    } else if (selectedMethod === 'bank') {
      if (!transactionId && !screenshotUrl) {
        showToast('Please provide Transaction Reference or upload screenshot.', 'error');
        return;
      }
      submitOrder({
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'Verification Pending',
        orderStatus: 'Order Placed',
        transactionId: transactionId,
        screenshotUrl: screenshotUrl
      });
    } else if (selectedMethod === 'stripe') {
      // Placeholder for Stripe/Razorpay logic
      // TODO: Implement actual Stripe/Razorpay SDK integration here.
      
      // Simulate success for demo purposes
      submitOrder({
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        transactionId: 'STRIPE-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        screenshotUrl: ''
      });
    }
  };

  if (!state?.billingDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
      <Navebar />
      
      {toast && (
        <div className={`fixed top-24 right-8 px-6 py-3 rounded-lg shadow-lg font-bold z-50 animate-fade-in-down ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-10 max-w-screen-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Payment Methods</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
              </div>
              
              <div className="p-6 space-y-4">
                
                {/* Stripe / Card */}
                <div className={`border rounded-xl transition-all ${selectedMethod === 'stripe' ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <input type="radio" name="paymentMethod" checked={selectedMethod === 'stripe'} onChange={() => setSelectedMethod('stripe')} className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500" />
                    <div className="ml-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FiCreditCard size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">Card Payment (Stripe / Razorpay)</span>
                        <span className="text-xs text-gray-500">Pay securely with Credit/Debit Card, Net Banking, or Wallet</span>
                      </div>
                    </div>
                  </label>
                  {selectedMethod === 'stripe' && (
                    <div className="px-14 pb-4 animate-fade-in">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 italic">
                        Stripe/Razorpay SDK integration placeholder. Clicking Place Order will simulate a successful transaction. 
                        {/* TODO: Add Stripe Elements or Razorpay Checkout here */}
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Payment */}
                <div className={`border rounded-xl transition-all ${selectedMethod === 'upi' ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <input type="radio" name="paymentMethod" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500" />
                    <div className="ml-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <FiSmartphone size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">UPI Payment</span>
                        <span className="text-xs text-gray-500">Pay using GPay, PhonePe, Paytm, etc.</span>
                      </div>
                    </div>
                  </label>
                  {selectedMethod === 'upi' && (
                    <div className="px-14 pb-4 animate-fade-in">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 shrink-0">
                            <span className="text-gray-400 text-sm">QR Code<br/>Placeholder</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Scan the QR code or use the UPI ID below:</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono font-bold text-lg text-gray-900">bookstore@upi</span>
                              <button type="button" onClick={() => handleCopy('bookstore@upi')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"><FiCopy /></button>
                            </div>
                            <p className="text-xs text-gray-400">Please complete the payment on your app before submitting.</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">UPI Transaction ID (UTR)</label>
                            <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="e.g. 123456789012" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                          </div>
                          <div className="text-center font-semibold text-gray-400">OR</div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Payment Screenshot</label>
                            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <div className="flex flex-col items-center">
                                {screenshotUrl ? <FiCheckCircle className="text-green-500 mb-2" size={24} /> : <FiUploadCloud className="text-gray-400 mb-2" size={24} />}
                                <span className="text-sm text-gray-600">{screenshotUrl ? 'Screenshot Attached' : 'Click to upload image'}</span>
                              </div>
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bank Transfer */}
                <div className={`border rounded-xl transition-all ${selectedMethod === 'bank' ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <input type="radio" name="paymentMethod" checked={selectedMethod === 'bank'} onChange={() => setSelectedMethod('bank')} className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500" />
                    <div className="ml-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <FiBriefcase size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">Direct Bank Transfer</span>
                        <span className="text-xs text-gray-500">Transfer directly to our bank account</span>
                      </div>
                    </div>
                  </label>
                  {selectedMethod === 'bank' && (
                    <div className="px-14 pb-4 animate-fade-in">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl mb-4">
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
                          <div className="text-gray-500">Bank Name:</div><div className="font-bold text-gray-900">Global Book Bank</div>
                          <div className="text-gray-500">Account Name:</div><div className="font-bold text-gray-900">Modern BookStore Inc</div>
                          <div className="text-gray-500 flex items-center">Account Number:</div>
                          <div className="font-bold text-gray-900 flex items-center gap-2 font-mono">
                            345678901234 
                            <button type="button" onClick={() => handleCopy('345678901234')} className="p-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"><FiCopy size={14}/></button>
                          </div>
                          <div className="text-gray-500">IFSC Code:</div><div className="font-bold text-gray-900 font-mono">GBBK0001234</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction Reference Number</label>
                          <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Enter reference number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div className="text-center font-semibold text-gray-400">OR</div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Payment Screenshot</label>
                          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex flex-col items-center">
                              {screenshotUrl ? <FiCheckCircle className="text-green-500 mb-2" size={24} /> : <FiUploadCloud className="text-gray-400 mb-2" size={24} />}
                              <span className="text-sm text-gray-600">{screenshotUrl ? 'Screenshot Attached' : 'Click to upload image'}</span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div className={`border rounded-xl transition-all ${selectedMethod === 'cod' ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <input type="radio" name="paymentMethod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500" />
                    <div className="ml-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <FiDollarSign size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">Cash on Delivery (COD)</span>
                        <span className="text-xs text-gray-500">Pay when your order arrives</span>
                      </div>
                    </div>
                  </label>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="border-b border-gray-100 pb-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Deliver to:</p>
                <p className="font-bold text-gray-900">{state.billingDetails.fullName}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{state.billingDetails.address}</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({state.cartItems.length} items)</span>
                  <span className="font-semibold">{formatCurrency(state.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-4 border-t border-gray-100 mt-4">
                  <span>Total</span>
                  <span className="text-pink-600">{formatCurrency(state.totalAmount)}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isSubmitting}
                className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all shadow-md hover:shadow-lg disabled:bg-pink-300 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ${formatCurrency(state.totalAmount)}`
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

export default Payment;
