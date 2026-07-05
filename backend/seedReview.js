const mongoose = require('mongoose');
const Review = require('./models/Review');
const User = require('./models/User');
const Book = require('./models/Book');

mongoose.connect('mongodb://localhost:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log("Connected to MongoDB for seeding review...");
    
    // We can use any dummy ObjectIds if there are no users/books, 
    // but the models exist so we can just use new ObjectIds.
    const dummyReview = new Review({
        bookId: new mongoose.Types.ObjectId(),
        bookTitle: "To Kill a Mockingbird",
        userId: new mongoose.Types.ObjectId(),
        userName: "John Doe",
        rating: 5,
        comment: "This book is an absolute classic. The character development is incredible and the themes are still so relevant today. Highly recommended!",
        status: "Approved"
    });
    
    const dummyReview2 = new Review({
        bookId: new mongoose.Types.ObjectId(),
        bookTitle: "1984 by George Orwell",
        userId: new mongoose.Types.ObjectId(),
        userName: "Jane Smith",
        rating: 2,
        comment: "A bit too depressing for my taste, though well written.",
        status: "Hidden"
    });

    await Review.insertMany([dummyReview, dummyReview2]);
    console.log("Reviews seeded successfully.");
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
