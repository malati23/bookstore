// Import the mongoose module which provides a straightforward, schema-based solution to model application data
const mongoose = require('mongoose');

// Define an asynchronous function to handle the database connection
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        // If the connection is successful, log a success message showing the host name
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        // If the connection fails, log a clear error message
        console.error(`Error connecting to MongoDB: ${error.message}`);
        
        // Exit the Node.js process with a failure status code (1) because our app cannot run without a database
        process.exit(1);
    }
};

// Export the connectDB function so it can be imported and called in server.js
module.exports = connectDB;
