import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const Profile = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // If not logged in, redirect after a tiny delay for smooth UX
    if (!authUser) {
      navigate('/');
      setTimeout(() => document.getElementById("my_modal_3")?.showModal(), 100);
    } else {
      // Simulate data fetch time for skeleton loader
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  }, [authUser, navigate]);

  // If redirected, prevent rendering the rest of the page
  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 font-sans">
      <Navebar />
      
      {/* Gradient Header Background */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 w-full relative z-0 shadow-inner">
        {/* Decorative pattern overlays */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <main className="flex-grow container mx-auto px-4 lg:px-8 max-w-screen-xl -mt-24 relative z-10 mb-16">
        
        {loading ? (
          // Skeleton Loader
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center animate-pulse">
                <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="w-full space-y-4 mt-8">
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-6 bg-gray-100 rounded w-full"></div></div>
                  <div><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-6 bg-gray-100 rounded w-full"></div></div>
                  <div><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-6 bg-gray-100 rounded w-full"></div></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center transform transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${authUser.name}&background=ec4899&color=fff&size=150`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover mb-4 z-10 relative"
                  />
                  <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-30 -z-10 transform scale-110"></div>
                </div>
                
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1 capitalize">{authUser.name}</h2>
                <p className="text-gray-500 mb-4">{authUser.email}</p>
                <div className="bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6 inline-block">
                  Member since {new Date().getFullYear()}
                </div>
                
                <button className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-all shadow-md active:scale-95 mb-8">
                  Edit Profile
                </button>

                <div className="w-full border-t border-gray-100 pt-6 space-y-2 text-left">
                  <Link to="/Profile" className="flex items-center gap-4 text-gray-700 hover:text-pink-600 bg-pink-50 px-4 py-3 rounded-xl font-semibold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    My Profile
                  </Link>
                  <Link to="/Orders" className="flex items-center gap-4 text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-3 rounded-xl font-semibold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    My Orders
                  </Link>
                  <Link to="/Course" className="flex items-center gap-4 text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-3 rounded-xl font-semibold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Wishlist
                  </Link>
                  <button className="w-full flex items-center gap-4 text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-3 rounded-xl font-semibold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }} 
                    className="w-full flex items-center gap-4 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl font-semibold transition-colors mt-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-2/3 space-y-8">
              
              {/* Account Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Total Orders</h3>
                    <p className="text-2xl font-extrabold text-gray-900">2</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Wishlist Books</h3>
                    <p className="text-2xl font-extrabold text-gray-900">14</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Books Read</h3>
                    <p className="text-2xl font-extrabold text-gray-900">8</p>
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  <button className="text-pink-500 font-bold hover:text-pink-600 transition-colors text-sm bg-pink-50 px-4 py-2 rounded-lg">
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</h4>
                    <p className="text-lg text-gray-900 font-medium capitalize">{authUser.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</h4>
                    <p className="text-lg text-gray-900 font-medium">{authUser.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</h4>
                    <p className="text-lg text-gray-900 font-medium">+1 (555) 123-4567 <span className="text-xs text-gray-400 font-normal ml-2 italic">(Not set)</span></p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Joined Date</h4>
                    <p className="text-lg text-gray-900 font-medium">July 2026</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Shipping Address</h4>
                    <p className="text-lg text-gray-900 font-medium">123 Bookstore Avenue, Tech District, Cityville, NY 10001 <span className="text-xs text-gray-400 font-normal ml-2 italic">(Default)</span></p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security & Quick Actions</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 py-3 px-4 border-2 border-pink-500 text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-colors">
                    Change Password
                  </button>
                  <Link to="/Orders" className="flex-1 py-3 px-4 bg-gray-900 text-white font-bold rounded-xl text-center hover:bg-gray-800 transition-colors">
                    View Order History
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
