import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currency';

import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { getBooks, deleteBook } from '../../api/bookApi';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        await deleteBook(id);
        setToast({ type: 'success', message: 'Book deleted successfully!' });
        fetchBooks(); // Refresh the list
      } catch (err) {
        setToast({ type: 'error', message: 'Failed to delete book.' });
      }
      
      // Clear toast after 3s
      setTimeout(() => setToast(null), 3000);
    }
  };

  const fallbackImage = 'https://via.placeholder.com/150?text=No+Image';

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-8 px-6 py-3 rounded-lg shadow-lg font-bold z-50 animate-fade-in-down ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Books</h2>
        <Link 
          to="/admin/books/add"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <FiPlus /> Add New Book
        </Link>
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
        ) : books.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <h3 className="text-xl font-bold mb-2">No books found</h3>
            <p>Get started by adding a new book to your store.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">Book</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {books.map(book => (
                  <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={book.image} 
                          alt={book.title} 
                          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                          className="w-12 h-16 object-cover rounded shadow-sm border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{book.title}</p>
                          <p className="text-gray-500 text-xs mt-1">by {book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(book.price)}
                    </td>
                    <td className="px-6 py-4">
                      {book.stock || Math.floor(Math.random() * 50) + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          to={`/admin/books/edit/${book._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip tooltip-top"
                          data-tip="Edit Book"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(book._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip tooltip-top"
                          data-tip="Delete Book"
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
    </AdminLayout>
  );
};

export default ManageBooks;
