const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register (To be created later)
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    // 1. Receive name, email, password from request body
    const { name, email, password } = req.body;

    // 2. Validate required fields
    if (!name || !email || !password) {
      // 400 Bad Request: Missing required data
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    // 3. Check if the email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      // 400 Bad Request: User already exists
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 4. Hash the password using bcrypt
    // IMPORTANT NOTE: The password hashing is automatically handled by the pre('save') hook 
    // we defined in the User model in Step 1. We just pass the plain password here, 
    // and Mongoose handles the hashing securely before saving to the database.
    
    // 5. Create a new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed automatically by the model
    });

    if (user) {
      // 6. Generate a JWT token for auto-login
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret_key_for_development',
        { expiresIn: '30d' }
      );

      // Send Welcome Email asynchronously
      // emailService.sendWelcomeEmail(user.email, user.name);

      // 7. Return success message, token, and user details
      // 201 Created: The resource was successfully created
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // 400 Bad Request: Fallback for invalid user data
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // 500 Internal Server Error: Something went wrong on the server
    console.error(error);
    next(error);
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login (To be created later)
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    // 1. Receive email and password from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      // 400 Bad Request: Missing required data
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      // 401 Unauthorized: Invalid credentials (user not found)
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Compare the entered password with the hashed password
    // Using the instance method comparePassword() we created in the User model
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // 401 Unauthorized: Invalid credentials (password incorrect)
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Generate a JWT token
    // The payload includes the user ID and role. process.env.JWT_SECRET should be defined in .env
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '30d' }
    );

    // 5. Return the token and user information
    // 200 OK: Request succeeded
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // 500 Internal Server Error: Something went wrong on the server
    console.error(error);
    next(error);
  }
};

/**
 * @desc    Forgot Password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide an email' });

    const user = await User.findOne({ email });
    
    // Always return a generic message to prevent email enumeration, even if user isn't found
    const genericMessage = 'If an account exists with this email, a password reset link has been sent.';

    if (!user) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // We will just store the direct token and expire time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Construct the reset URL
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // Send the password reset email asynchronously using Resend
    emailService.sendResetEmail(user.email, resetLink).catch(err => {
      console.error("Failed to send password reset email:", err.message);
    });

    res.status(200).json({ 
      success: true, 
      message: genericMessage
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: 'Please provide a new password' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password (it will be hashed by pre-save middleware)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send the password change confirmation email asynchronously
    // emailService.sendPasswordChangeConfirmationEmail(user.email, user.name).catch(err => {
    //   console.error("Failed to send password change confirmation email:", err.message);
    // });

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
