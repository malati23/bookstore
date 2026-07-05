const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for guest checkouts if any
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Verification Pending', 'Paid', 'Unpaid', 'Refunded', 'Failed'],
    default: 'Pending',
  },
  transactionId: {
    type: String,
    default: '',
  },
  screenshotUrl: {
    type: String,
    default: '',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
