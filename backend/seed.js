const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const connectDB = require('./config/database');
const list = require('../frontend/src/assets/List.json');

dotenv.config();

const seedDB = async () => {
    try {
        await connectDB();
        
        // Clear existing books
        await Book.deleteMany();
        console.log("Existing books removed.");

        // Format data to match our Book model
        const booksToInsert = list.map(item => ({
            title: item.name || item.title || "Untitled",
            author: "Admin", // Default author since it's missing in JSON
            category: item.category || "General",
            price: item.price || 0,
            description: item.title || "A great book.",
            image: item.image || "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books_23-2149342941.jpg"
        }));

        // Insert new data
        await Book.insertMany(booksToInsert);
        console.log("Database successfully seeded with books!");
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
