import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When the application starts or refreshes, read from Local Storage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    // If a token and user exist in local storage, restore the session
    if (storedUser && storedToken) {
      setAuthUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    // Save to Local Storage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    // Update State
    setAuthUser(userData);
  };

  const logout = () => {
    // Remove from Local Storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear State
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
