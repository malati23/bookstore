import React, { useState, useEffect } from 'react';
import { getBooks } from '../api/bookApi';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortDropdown from '../components/SortDropdown';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        setFilteredBooks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];

    // 1. Search Filter (by title, author, or category)
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(lowercasedSearch) ||
          book.author.toLowerCase().includes(lowercasedSearch) ||
          book.category.toLowerCase().includes(lowercasedSearch)
      );
    }

    // 2. Category Filter
    if (category) {
      result = result.filter((book) => book.category === category);
    }

    // 3. Sorting
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'rating-desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredBooks(result);
  }, [books, searchTerm, category, sortOrder]);

  // Get unique categories for dropdown
  const uniqueCategories = [...new Set(books.map((book) => book.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col pt-16">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-2xl">
        {/* Top Section */}
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our vast collection of books across multiple genres. From thrilling mysteries to inspiring biographies, find the perfect read for your weekend.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="md:col-span-3">
              <CategoryFilter categories={uniqueCategories} value={category} onChange={setCategory} />
            </div>
            <div className="md:col-span-3">
              <SortDropdown value={sortOrder} onChange={setSortOrder} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No books found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setCategory(''); setSortOrder('default'); }}
              className="mt-4 px-4 py-2 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
