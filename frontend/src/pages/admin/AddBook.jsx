import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { createBook } from '../../api/bookApi';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '', // The backend uses 'name' for title
    title: '',
    author: '',
    category: '',
    price: '',
    description: '',
    image: '',
    language: 'English',
    stock: 10
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // If typing in title, also sync name to prevent backend errors if it relies on name
      ...(name === 'title' && { name: value })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert price and stock to numbers before sending
      const submissionData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      await createBook(submissionData);
      
      // Store a flag in session storage so ManageBooks knows to show a toast
      sessionStorage.setItem('adminToast', JSON.stringify({ type: 'success', message: 'Book created successfully!' }));
      
      navigate('/admin/books');
    } catch (err) {
      console.error(err);
      setError('Failed to create book. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/books" className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. The Great Gatsby"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. F. Scott Fitzgerald"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                  <select 
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Biography">Biography</option>
                    <option value="Children">Children</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 19.99"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                  <input 
                    type="text" 
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="e.g. English"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Stock</label>
                  <input 
                    type="number" 
                    name="stock"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL <span className="text-red-500">*</span></label>
                <input 
                  type="url" 
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                />
                {formData.image && (
                  <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-40 object-contain rounded shadow-sm"
                      onError={(e) => { e.target.style.display = 'none'; }}
                      onLoad={(e) => { e.target.style.display = 'block'; }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter book description here..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                <Link 
                  to="/admin/books"
                  className="px-6 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </Link>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full block"></span>
                  ) : (
                    <FiSave size={20} />
                  )}
                  {loading ? 'Saving...' : 'Save Book'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBook;
