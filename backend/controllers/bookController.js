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
