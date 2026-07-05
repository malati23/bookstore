const express = require('express');
const router = express.Router();

const {
  getAllReviews,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');

router.get('/', getAllReviews);
router.put('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

module.exports = router;
