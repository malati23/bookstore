import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthProvider';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setErrorMsg(null);
    setIsLoading(true);
    
    console.log('--- LOGIN DEBUGGING ---');
    console.log('1. Login request data:', data);

    try {
      // loginApi uses axios and returns response.data directly.
      const response = await loginApi(data);
      console.log('2. Backend response:', response);
      
      // Because authApi.js returns response.data, 
      // the 'response' object IS the JSON containing token and user
      const token = response.token;
      const user = response.user;

      console.log('3. Token:', token);
      console.log('4. User object:', user);

      if (token && user) {
        // Explicitly set localStorage as requested
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Update the authentication context state
        login(user, token);
        
        // Close the modal
        const modal = document.getElementById("my_modal_3");
        if (modal) {
          modal.close();
        }

        // Redirect to Home page after successful login
        navigate('/');
      } else {
        console.error("Token or User is missing from the backend response. Check your backend authController.js.");
        setErrorMsg("Invalid response from server (missing token or user).");
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Close button */}
            <button 
              type="button"
              onClick={() => document.getElementById("my_modal_3").close()}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</button>
         
            <h3 className="font-bold text-lg mb-4">Login</h3>

            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                {errorMsg}
              </div>
            )}

            <div className='mt-4 space-y-2'>
              <label className="block text-sm font-medium">Email</label>
              <input 
                type='email' 
                placeholder='Enter your email' 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                {...register('email', { required: true })} 
              />
              {errors.email && <span className='text-xs text-red-500 block mt-1'>Email is required</span>}
            </div>
            
            <div className='mt-4 space-y-2'>
              <label className="block text-sm font-medium">Password</label>
              <input 
                type='password' 
                placeholder='Enter your password' 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                {...register('password', { required: true })} 
              />
              {errors.password && <span className='text-xs text-red-500 block mt-1'>Password is required</span>}
              <div className="text-right mt-1">
                <Link to="/forgot-password" onClick={() => document.getElementById("my_modal_3").close()} className="text-xs text-pink-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            <div className='flex justify-between items-center mt-6'>
              <button 
                type="submit" 
                disabled={isLoading}
                className='bg-pink-500 text-white font-medium rounded-md px-6 py-2 hover:bg-pink-600 duration-200 disabled:bg-pink-300'
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <p className="text-sm">
                Not registered?
                <Link to="/Signup" className='text-pink-500 hover:underline font-medium ml-1' onClick={() => document.getElementById("my_modal_3").close()}>
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default Login;
