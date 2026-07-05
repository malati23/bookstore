import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuth();
  const location = useLocation();

  // If the user is not authenticated, redirect them to the login page
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location.pathname, message: "Please log in to access the Course page." }} replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
