const Review = require('../models/Review');

// Fetch all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update review status
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllReviews,
  updateReviewStatus,
  deleteReview
};
