import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiTrash2, FiX, FiCheckCircle, FiEyeOff } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReviews, updateReviewStatus, deleteReview } from '../../api/reviewApi';
import RatingStars from '../../components/RatingStars'; // reusing existing component

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await updateReviewStatus(reviewId, newStatus);
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to permanently delete this review?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter(r => r._id !== reviewId));
        if (selectedReview?._id === reviewId) setIsModalOpen(false);
      } catch (err) {
        alert("Failed to delete review");
      }
    }
  };

  const openDetails = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Filtering Logic
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase());
      
    let matchesFilter = true;
    if (ratingFilter !== 'All') {
      matchesFilter = review.rating === parseInt(ratingFilter);
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Reviews</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Book or User..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-64"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none w-full sm:w-40 cursor-pointer relative"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse flex gap-4 h-16 bg-gray-50 rounded-xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium">{error}</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiStar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">No reviews found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredReviews.map(review => (
                  <tr key={review._id} className={`transition-colors ${review.status === 'Hidden' ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 font-bold text-gray-900 max-w-[200px] truncate">
                      {review.bookTitle}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${review.userName}&background=random&color=fff`} 
                          alt={review.userName} 
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium text-gray-800">{review.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-400">
                        {/* Render stars manually since RatingStars might expect interactive props depending on implementation */}
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        review.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {review.status === 'Approved' ? (
                          <button 
                            onClick={() => handleStatusChange(review._id, 'Hidden')}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors tooltip tooltip-top"
                            data-tip="Hide Review"
                          >
                            <FiEyeOff size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(review._id, 'Approved')}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors tooltip tooltip-top"
                            data-tip="Approve Review"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => openDetails(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip tooltip-top"
                          data-tip="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip tooltip-top"
                          data-tip="Delete Review"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedReview.userName}&background=random&color=fff`} 
                  alt={selectedReview.userName} 
                  className="w-12 h-12 rounded-full shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{selectedReview.userName}</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedReview.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Book Title</p>
                <p className="font-bold text-gray-900">{selectedReview.bookTitle}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rating</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < selectedReview.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Review Comment</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed italic">
                  "{selectedReview.comment}"
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                {selectedReview.status === 'Approved' ? (
                  <button 
                    onClick={() => handleStatusChange(selectedReview._id, 'Hidden')}
                    className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <FiEyeOff /> Hide Review
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStatusChange(selectedReview._id, 'Approved')}
                    className="px-4 py-2 border-2 border-green-200 text-green-700 bg-green-50 font-bold rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                  >
                    <FiCheckCircle /> Approve Review
                  </button>
                )}
                
                <button 
                  onClick={() => handleDeleteReview(selectedReview._id)}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageReviews;
