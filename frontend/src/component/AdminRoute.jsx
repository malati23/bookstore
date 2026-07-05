import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const AdminRoute = ({ children }) => {
  const { authUser } = useAuth();

  // Temporarily disable the 'admin' role check for development
  // if (!authUser || authUser.role !== 'admin') {
  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default AdminRoute;
