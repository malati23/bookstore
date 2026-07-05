import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthProvider';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path and message from state (if navigated via ProtectedRoute)
  const from = location.state?.from || '/';
  const message = location.state?.message || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setErrorMsg(null);
    setIsLoading(true);
    
    try {
      const response = await loginApi(data);
      const token = response.token;
      const user = response.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        login(user, token);
        
        // Redirect back to the originally requested URL, or home
        navigate(from, { replace: true });
      } else {
        setErrorMsg("Invalid response from server");
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navebar />
      <div className='flex-grow flex justify-center items-center py-10'>
        <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-16'>
          <h3 className="font-bold text-2xl text-center mb-6 text-gray-800">Login</h3>

          {message && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-sm text-center font-medium">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type='email' 
                placeholder='Enter your email' 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                {...register('email', { required: true })} 
              />
              {errors.email && <span className='text-xs text-red-500 block mt-1'>Email is required</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type='password' 
                placeholder='Enter your password' 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                {...register('password', { required: true })} 
              />
              {errors.password && <span className='text-xs text-red-500 block mt-1'>Password is required</span>}
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-xs text-pink-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            <div className='flex flex-col mt-6'>
              <button 
                type="submit" 
                disabled={isLoading}
                className='w-full bg-pink-500 text-white font-semibold rounded-md px-4 py-2 hover:bg-pink-600 transition-colors disabled:bg-pink-300 flex justify-center items-center'
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Not registered?
                <Link to="/Signup" className='text-pink-500 hover:underline font-medium ml-1'>
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
