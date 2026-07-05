import React from 'react';
import AdminLayout from './admin/AdminLayout';
import { useLocation } from 'react-router-dom';

const AdminPlaceholder = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop();
  
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 capitalize mb-3">
          Manage {pageName}
        </h2>
        <p className="text-gray-500 max-w-md">
          This admin module is currently under construction. Please check back later when it's fully implemented!
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminPlaceholder;
