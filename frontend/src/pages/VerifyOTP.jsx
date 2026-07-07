import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [message, setMessage] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      // If accessed directly without an email in state, redirect back
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Timer logic
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setMessage(response.data.message || 'OTP has been sent successfully.');
      setCountdown(60); // Reset timer
    } catch (err) {
      console.error('Resend OTP Error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp });
      
      // Save token and user details to localStorage (standard login process)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Navigate directly to the Courses page upon successful authentication
        navigate('/Course');
        // Refresh to update app state if necessary, or just navigate
        window.location.reload(); 
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
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
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Verify OTP</h1>
            <p className="text-gray-500 text-sm">
              We've sent a 6-digit OTP to <strong>{email}</strong>. Enter it below to log in.
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">6-Digit OTP</label>
              <input 
                type="text" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only allow digits
                placeholder="123456" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50 focus:bg-white text-center text-2xl tracking-[0.5em]"
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
                  Verifying...
                </>
              ) : (
                'Verify & Log In'
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center space-y-2">
            <button
              onClick={handleResendOTP}
              disabled={countdown > 0 || resendLoading}
              className={`text-sm font-medium transition-colors ${countdown > 0 || resendLoading ? 'text-gray-400 cursor-not-allowed' : 'text-pink-600 hover:text-pink-700'}`}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
            {countdown > 0 && (
              <p className="text-xs text-gray-500">
                You can resend OTP in <span className="font-bold text-gray-700">{countdown}s</span>
              </p>
            )}
            <div className="pt-4">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-pink-600 font-medium transition-colors">
                Change Email Address
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyOTP;
