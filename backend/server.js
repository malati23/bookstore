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
// Any request starting with "/api/books" will be handled by the bookRoutes router
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
// Any request starting with "/api/auth" will be routed to the authRoutes router
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
    // Send a response string back to the client
    res.send("BookStore API Running Successfully 🚀");
});

// Read the PORT variable from process.env, or default to 5000 if not found
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming connections on the specified PORT
app.listen(PORT, () => {
    // Log a message to the console confirming the server is running
    console.log(`Server is running on port ${PORT}`);
});
