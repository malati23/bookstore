const express = require('express');
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus);

module.exports = router;
