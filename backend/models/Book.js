// Import mongoose to create the schema and model
const mongoose = require('mongoose');

// Define the BookSchema using Mongoose
// A schema defines the structure of the document, default values, validators, etc.
const BookSchema = new mongoose.Schema({
    // The title of the book
    title: {
        type: String,        // Must be a string
        required: true,      // This field is mandatory
        trim: true,          // Removes extra spaces from beginning and end
        minLength: 2,        // Minimum length of 2 characters
        maxLength: 150       // Maximum length of 150 characters
    },
    // The author of the book
    author: {
        type: String,
        required: true,
        trim: true
    },
    // The category the book belongs to (e.g., Fiction, Science)
    category: {
        type: String,
        required: true,
        trim: true
    },
    // The price of the book
    price: {
        type: Number,
        required: true,
        min: 0               // Price cannot be negative
    },
    // A brief description of the book
    description: {
        type: String,
        required: true,
        trim: true
    },
    // URL or path to the book's cover image
    image: {
        type: String,
        required: true
    },
    // Number of books available in stock
    stock: {
        type: Number,
        default: 0,          // Defaults to 0 if not provided
        min: 0               // Stock cannot be negative
    },
    // The rating of the book
    rating: {
        type: Number,
        default: 0,
        min: 0,              // Minimum rating is 0
        max: 5               // Maximum rating is 5
    },
    // The year the book was published (optional)
    publishedYear: {
        type: Number
    },
    // The language the book is written in
    language: {
        type: String,
        default: "English"   // Defaults to English if not specified
    },
    // Timestamp for when the book document was created
    createdAt: {
        type: Date,
        default: Date.now    // Automatically sets to current date/time
    }
});

// Export the model
// A Model is a compiled version of the schema, providing an interface to interact with the database
module.exports = mongoose.model("Book", BookSchema);
