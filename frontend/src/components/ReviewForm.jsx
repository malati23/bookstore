import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';

const ReviewForm = ({ initialData, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setTitle(initialData.title);
      setMessage(initialData.message);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!title.trim() || !message.trim()) {
      setError('Please provide both a title and a review message.');
      return;
    }
    
    setError('');
    onSubmit({ rating, title, message });
    
    if (!initialData) {
      setRating(0);
      setTitle('');
      setMessage('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 animate-fade-in-up">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {initialData ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <RatingStars rating={rating} setRating={setRating} interactive={true} size="w-8 h-8" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Review Title <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Review Message <span className="text-red-500">*</span>
          </label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What did you like or dislike?"
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white resize-none transition-colors"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            className="bg-pink-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-sm active:scale-95 flex-1"
          >
            {initialData ? 'Update Review' : 'Submit Review'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
