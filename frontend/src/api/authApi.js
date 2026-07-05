import axios from 'axios';

// Base URL for the authentication API
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

/**
 * Register a new user
 * @param {Object} userData - The user data containing name, email, and password
 * @returns {Promise<Object>} - The response data from the server
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Something went wrong during registration');
  }
};

/**
 * Login a user
 * @param {Object} userData - The user data containing email and password
 * @returns {Promise<Object>} - The response data containing token and user details
 */
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Something went wrong during login');
  }
};
