import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import RatingStars from './RatingStars';

const ReviewsSection = ({ bookId }) => {
  const { authUser } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Load reviews from local storage simulating Axios call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const storedReviews = localStorage.getItem(`reviews_${bookId}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
      setLoading(false);
    }, 500); // simulate network delay
  }, [bookId]);

  // Save reviews whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));
    }
  }, [reviews, bookId, loading]);

  const handleAddReview = (reviewData) => {
    const newReview = {
      id: Date.now().toString(),
      userEmail: authUser.email,
      userName: authUser.name,
      rating: reviewData.rating,
      title: reviewData.title,
      message: reviewData.message,
      date: new Date().toISOString()
    };
    
    setReviews([newReview, ...reviews]);
    setShowForm(false);
  };

  const handleUpdateReview = (reviewData) => {
    const updatedReviews = reviews.map(r => 
      r.id === editingReview.id 
        ? { ...r, ...reviewData, date: new Date().toISOString() } // update date on edit
        : r
    );
    setReviews(updatedReviews);
    setEditingReview(null);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'newest': return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest': return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest': return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest': return sorted.sort((a, b) => a.rating - b.rating);
      default: return sorted;
    }
  };

  const calculateStats = () => {
    if (reviews.length === 0) return { average: 0, breakdown: {5:0, 4:0, 3:0, 2:0, 1:0} };
    
    let total = 0;
    const breakdown = {5:0, 4:0, 3:0, 2:0, 1:0};
    
    reviews.forEach(r => {
      total += r.rating;
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });
    
    return {
      average: (total / reviews.length).toFixed(1),
      breakdown
    };
  };

  const stats = calculateStats();
  const sortedReviews = getSortedReviews();
  const userHasReviewed = authUser && reviews.some(r => r.userEmail === authUser.email);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-10 shadow-xl border border-gray-100 dark:border-slate-700">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-700 pb-4">
        Customer Reviews
      </h2>

      {/* Review Stats Header */}
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        
        {/* Average Stats */}
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 min-w-[200px]">
          <span className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">{stats.average}</span>
          <RatingStars rating={Math.round(stats.average)} size="w-5 h-5 mb-2" />
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Based on {reviews.length} reviews</span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = stats.breakdown[star];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium w-12">{star} Stars</span>
                <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Area & Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
        <div>
          {!authUser ? (
            <p className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Please <button onClick={() => document.getElementById("my_modal_3").showModal()} className="text-pink-500 hover:underline">login</button> to write a review.
            </p>
          ) : userHasReviewed && !editingReview ? (
            <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              You have already reviewed this book.
            </p>
          ) : !showForm && !editingReview ? (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-pink-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-sm active:scale-95"
            >
              Write a Review
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Sort By:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Forms Container */}
      {(showForm || editingReview) && (
        <div className="mb-10">
          <ReviewForm 
            initialData={editingReview} 
            onSubmit={editingReview ? handleUpdateReview : handleAddReview} 
            onCancel={() => { setShowForm(false); setEditingReview(null); }}
          />
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-gray-50 dark:bg-slate-900 h-32 rounded-2xl border border-gray-100 dark:border-slate-700"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
          <span className="text-5xl mb-4 block">⭐</span>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No reviews yet.</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to review this book!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedReviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onEdit={setEditingReview} 
              onDelete={handleDeleteReview} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
