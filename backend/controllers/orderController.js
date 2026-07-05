const Order = require('../models/Order');
const emailService = require('../services/emailService');

// 1. Fetch all orders (or by userId)
const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Fetch single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Create new order
const createOrder = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Update order status
const updateOrderStatus = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. Update payment status
const updatePaymentStatus = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus
};
