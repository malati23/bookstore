import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setMessage(response.data.message || 'If an account exists with this email, an OTP has been sent.');
      
      // Delay navigation slightly to let user read the message, or navigate immediately
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 1500);

    } catch (err) {
      console.error('Forgot Password Error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
      <Navebar />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Passwordless Login</h1>
            <p className="text-gray-500 text-sm">
              Enter the email address associated with your account and we'll send you a 6-digit OTP to log in securely.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium mb-6 border border-green-100">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-8 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-all shadow-md hover:shadow-lg disabled:bg-pink-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" onClick={() => setTimeout(() => document.getElementById("my_modal_3")?.showModal(), 100)} className="text-sm text-gray-500 hover:text-pink-600 font-medium transition-colors flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
