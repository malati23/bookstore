import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthProvider';

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State for success and error messages
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the password field to validate the confirm password
  const password = watch('password', '');

  const onSubmit = async (data) => {
    // Reset previous messages
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      // 1. Create user data object to send to the backend
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      // 2. Call the API function to register the user
      const response = await registerUser(userData);

      // 3. Extract token and user from the response
      // (authApi.js returns response.data directly, so 'response' contains the JSON)
      const token = response.token;
      const user = response.user;

      if (token && user) {
        // 4. Save to Local Storage explicitly
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // 5. Update the authentication state
        login(user, token);

        // 6. Show success message
        setSuccessMsg('Registration successful! Logging you in...');

        // 7. Redirect to Course page after a short delay
        setTimeout(() => {
          navigate('/Course');
        }, 1500);
      } else {
        throw new Error("Invalid backend response: Missing token or user object.");
      }

    } catch (error) {
      // 5. Display backend error message (e.g. "User already exists")
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center min-h-screen items-center bg-gray-50 py-10'>
      <div className='relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Close Button */}
          <Link to={"/"} className="absolute right-4 top-4 text-gray-400 hover:text-red-500 font-bold transition-colors">
            ✕
          </Link>

          <h3 className="font-bold text-2xl text-center mb-6 text-gray-800">Create an Account</h3>

          {/* Success Message Toast */}
          {successMsg && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <div className='space-y-4'>
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type='text' 
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
                {...register('name', { required: 'Full Name is required' })}
              />
              {errors.name && <span className='text-xs text-red-500 mt-1 block'>{errors.name.message}</span>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type='email' 
                placeholder="email@example.com"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <span className='text-xs text-red-500 mt-1 block'>{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type='password' 
                placeholder="********"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} 
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              {errors.password && <span className='text-xs text-red-500 mt-1 block'>{errors.password.message}</span>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                type='password' 
                placeholder="********"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} 
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <span className='text-xs text-red-500 mt-1 block'>{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <div className='flex flex-col mt-6'>
            <button 
              type="submit" 
              disabled={isLoading}
              className='w-full bg-pink-500 text-white font-semibold rounded-md px-4 py-2 hover:bg-pink-600 transition-colors disabled:bg-pink-300 flex justify-center items-center'
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?
              <button 
                type="button" 
                className='text-pink-500 hover:underline font-medium ml-1'
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById("my_modal_3")?.showModal();
                  }, 50);
                }}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;