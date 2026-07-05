// Import the express module
const express = require('express');

// Create a new Express Router instance
// The router acts as a mini Express application specifically for handling routes
const router = express.Router();

// Import all the necessary controller functions from the bookController
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

// Define the REST API routes and map them to their respective controller functions

// GET request to "/" -> Fetches all books
router.get('/', getAllBooks);

// GET request to "/:id" -> Fetches a single book by its ID
// The ":id" is a dynamic parameter that will be available in req.params.id
router.get('/:id', getBookById);

// POST request to "/" -> Creates a new book
router.post('/', createBook);

// PUT request to "/:id" -> Updates an existing book by its ID
router.put('/:id', updateBook);

// DELETE request to "/:id" -> Deletes a book by its ID
router.delete('/:id', deleteBook);

// Export the router so it can be imported and used in the main server file
module.exports = router;
