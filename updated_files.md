# Complete Updated Code

## d:\mongodb-Bookstore\backend\server.js

`javascript
// Import the express module to create our web server
const express = require('express');

// Import cors to allow our frontend to communicate with this backend securely
const cors = require('cors');

// Import dotenv to load environment variables from the .env file into process.env
const dotenv = require('dotenv');

// Call dotenv.config() so that environment variables are available immediately
dotenv.config();

// Import our custom database connection function from the config folder
const connectDB = require('./config/database');

// Call the function to connect to the MongoDB database
connectDB();

// Create an instance of an Express application
const app = express();

// Use CORS middleware to enable Cross-Origin Resource Sharing
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://bookstore-seven-theta.vercel.app',
        'https://bookstore-d3a8e.firebaseapp.com',
        'https://bookstore-d3a8e.web.app'
    ],
    credentials: true
}));

// Use express.json() middleware to parse incoming JSON payloads in the request body
app.use(express.json());

// Import the book routes
const bookRoutes = require("./routes/bookRoutes");

// Register the book routes
app.use("/api/books", bookRoutes);

// Import the authentication routes
const authRoutes = require("./routes/authRoutes");

// Import the order routes
const orderRoutes = require("./routes/orderRoutes");

// Import the user routes
const userRoutes = require("./routes/userRoutes");

// Import the review routes
const reviewRoutes = require("./routes/reviewRoutes");

// Import the contact routes
const contactRoutes = require("./routes/contactRoutes");

// Import the settings routes
const settingRoutes = require("./routes/settingRoutes");

// Register the auth routes
app.use("/api/auth", authRoutes);

// Register the order routes
app.use("/api/orders", orderRoutes);

// Register the user routes
app.use("/api/users", userRoutes);

// Register the review routes
app.use("/api/reviews", reviewRoutes);

// Register the contact routes
app.use("/api/contact", contactRoutes);

// Register the settings routes
app.use("/api/settings", settingRoutes);

// Define a basic GET route at the root URL ("/") to test if the server is working
app.get('/', (req, res) => {
    res.send("BookStore API Running Successfully 🚀");
});

// Global Error Handler for detailed logging in Render
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.url}`);
    console.error("Error message:", err.message);
    console.error("Stack trace:", err.stack);
    
    // Fallback error response if headers haven't been sent
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            message: "Something went wrong on the server.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Read the PORT variable from process.env, or default to 5000 if not found
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming connections on the specified PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

`

## d:\mongodb-Bookstore\frontend\vercel.json

`javascript
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

`

## d:\mongodb-Bookstore\frontend\.env.production

`javascript
VITE_API_URL=https://bookstore-qfjw.onrender.com/api

`

## d:\mongodb-Bookstore\backend\controllers\authController.js

`javascript
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
      emailService.sendWelcomeEmail(user.email, user.name);

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

    // Send the password reset email asynchronously
    emailService.sendPasswordResetEmail(user.email, resetToken, user.name).catch(err => {
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
    emailService.sendPasswordChangeConfirmationEmail(user.email, user.name).catch(err => {
      console.error("Failed to send password change confirmation email:", err.message);
    });

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

`

## d:\mongodb-Bookstore\backend\controllers\bookController.js

`javascript
// Import the Book model to interact with the database
const Book = require('../models/Book');

// 1. Get all books
const getAllBooks = async (req, res, next) => {
    try {
        // Find all books in the database using the model
        const books = await Book.find();
        // Return a 200 OK status with the retrieved books in JSON format
        res.status(200).json(books);
    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error with the error message
        next(error);
    }
};

// 2. Get a single book by ID
const getBookById = async (req, res, next) => {
    try {
        // Find a specific book by the ID provided in the request parameters (URL: /books/:id)
        const book = await Book.findById(req.params.id);
        
        // If the book is not found in the database, return a 404 Not Found response
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        // Return a 200 OK status with the found book
        res.status(200).json(book);
    } catch (error) {
        // Return a 500 status if there's an error (e.g., invalid ID format)
        next(error);
    }
};

// 3. Create a new book
const createBook = async (req, res, next) => {
    try {
        // Create a new instance of the Book model with data from the request body
        // and save it to the database
        const newBook = await Book.create(req.body);
        
        // Return a 201 Created status along with the newly created book data
        res.status(201).json(newBook);
    } catch (error) {
        // If validation fails or another error occurs, return a 400 Bad Request status
        res.status(400).json({ message: "Failed to create book", error: error.message });
    }
};

// 4. Update an existing book
const updateBook = async (req, res, next) => {
    try {
        // Find the book by ID and update it with the data provided in the request body
        // { new: true } ensures the method returns the updated document rather than the old one
        // { runValidators: true } ensures the update data adheres to the Schema rules
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true 
        });
        
        // If the book to update is not found, return 404
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        // Return the updated book with a 200 OK status
        res.status(200).json(updatedBook);
    } catch (error) {
        // Return a 400 Bad Request status for validation errors or bad IDs
        res.status(400).json({ message: "Failed to update book", error: error.message });
    }
};

// 5. Delete a book
const deleteBook = async (req, res, next) => {
    try {
        // Find the book by ID and remove it from the database
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        
        // If the book to delete is not found, return 404
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        // Return a success message with a 200 OK status
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        // Return a 500 status if an error occurs during deletion
        next(error);
    }
};

// Export all the controller functions so they can be imported and used in the routes file
module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};

`

## d:\mongodb-Bookstore\backend\controllers\contactController.js

`javascript
const Contact = require('../models/Contact');

// Create new contact message
const createContact = async (req, res, next) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error("Error creating contact message:", error);
    next(error);
  }
};

// Fetch all contact messages
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    next(error);
  }
};

// Update contact status (e.g., mark as Read)
const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact message status:", error);
    next(error);
  }
};

// Delete a contact message
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({ message: "Contact message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    next(error);
  }
};

module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
};

`

## d:\mongodb-Bookstore\backend\controllers\orderController.js

`javascript
const Order = require('../models/Order');
const emailService = require('../services/emailService');

// 1. Fetch all orders (or by userId)
const getAllOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error);
  }
};

// 2. Fetch single order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    next(error);
  }
};

// 3. Create new order
const createOrder = async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    // Send email confirmation
    if (savedOrder.customerEmail) {
      emailService.sendOrderConfirmationEmail(savedOrder.customerEmail, savedOrder);
      
      // If it was an online payment that is already 'Completed'
      if (savedOrder.paymentStatus === 'Completed') {
        emailService.sendPaymentConfirmationEmail(savedOrder.customerEmail, savedOrder);
      }
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};

// 4. Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true } // Return the modified document rather than the original
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send email if status is Shipped or Delivered
    if (updatedOrder.customerEmail && (orderStatus === 'Shipped' || orderStatus === 'Delivered')) {
      emailService.sendOrderStatusEmail(updatedOrder.customerEmail, updatedOrder, orderStatus);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    next(error);
  }
};

// 5. Update payment status
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send payment confirmation email if status is completed
    if (updatedOrder.customerEmail && paymentStatus === 'Completed') {
      emailService.sendPaymentConfirmationEmail(updatedOrder.customerEmail, updatedOrder);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating payment status:", error);
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus
};

`

## d:\mongodb-Bookstore\backend\controllers\reviewController.js

`javascript
const Review = require('../models/Review');

// Fetch all reviews
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
  }
};

// Update review status
const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review status:", error);
    next(error);
  }
};

// Delete review
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    next(error);
  }
};

module.exports = {
  getAllReviews,
  updateReviewStatus,
  deleteReview
};

`

## d:\mongodb-Bookstore\backend\controllers\settingController.js

`javascript
const Setting = require('../models/Setting');

// Get settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    next(error);
  }
};

// Update settings
const updateSettings = async (req, res, next) => {
  try {
    const settingsData = req.body;
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting(settingsData);
      await settings.save();
    } else {
      settings = await Setting.findOneAndUpdate({}, settingsData, { new: true });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};

`

## d:\mongodb-Bookstore\backend\controllers\userController.js

`javascript
const User = require('../models/User');

// Fetch all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

// Update user role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    next(error);
  }
};

// Update user status
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user status:", error);
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser
};

`

