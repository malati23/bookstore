// Import the Express framework
const express = require('express');

// Create a new Express router instance to define our authentication-related routes
const router = express.Router();

// Import the specific controller functions that will handle the business logic for these routes
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 * 
 * Maps the POST request at the '/register' endpoint to the registerUser controller function.
 * This function will validate the incoming data, check for duplicate emails, 
 * create a new user (which automatically hashes the password), and return a success response.
 */
router.post('/register', registerUser);

/**
 * @route   POST /login
 * @desc    Authenticate an existing user and get a JWT token
 * @access  Public
 * 
 * Maps the POST request at the '/login' endpoint to the loginUser controller function.
 * This function will verify the user's email, compare the hashed password,
 * and if successful, generate and return a JSON Web Token (JWT) along with user data.
 */
router.post('/login', loginUser);

/**
 * @route   POST /forgot-password
 * @desc    Generate password reset token
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password/:token', resetPassword);

// Export the configured router so it can be imported and mounted in the main server.js file later
module.exports = router;
