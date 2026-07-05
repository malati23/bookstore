const mongoose = require('mongoose');
const Order = require('./models/Order');

mongoose.connect('mongodb://localhost:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log("Connected to MongoDB for seeding order...");
    const dummyOrder = new Order({
        customerName: "Alice Smith",
        customerEmail: "alice@example.com",
        phoneNumber: "555-1234",
        shippingAddress: "789 Oak Lane, Book Town",
        totalAmount: 125.50,
        books: [
            {
                bookId: new mongoose.Types.ObjectId(),
                title: "The Great Gatsby",
                quantity: 1,
                price: 15.50
            },
            {
                bookId: new mongoose.Types.ObjectId(),
                title: "1984 by George Orwell",
                quantity: 2,
                price: 55.00
            }
        ],
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        orderStatus: "Pending"
    });

    await dummyOrder.save();
    console.log("Order seeded successfully.");
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
