import React, { useEffect, useState } from "react";
import { formatCurrency } from '../utils/currency';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { getBooks } from "../api/bookApi";
import mockList from '../assets/List.json';

function Freebook() {
  const { addToCart } = useCart();
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreeBooks = async () => {
      try {
        const data = await getBooks();
        const finalData = data.length > 1 ? data : mockList;
        
        setAllBooks(finalData);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(finalData.map(book => book.category || 'General'))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        // Fallback to mock data
        setAllBooks(mockList);
        const uniqueCategories = ['All', ...new Set(mockList.map(book => book.category || 'General'))];
        setCategories(uniqueCategories);
        setLoading(false);
      }
    };

    fetchFreeBooks();
  }, []);

  const displayedBooks = activeCategory === 'All' 
    ? allBooks 
    : allBooks.filter(book => (book.category || 'General') === activeCategory);

  if (loading) {
    return <div className="text-center mt-10">Loading books...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Explore by Category</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover our vast collection of books tailored to your favorite genres. Find your next great read today!</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-pink-500 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-500 hover:text-pink-500'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayedBooks.map((item) => (
          <div key={item._id || item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            <div className="relative h-56 mb-4 overflow-hidden rounded-xl">
              <Link to={`/books/${item._id || item.id}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                />
              </Link>
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-pink-600 shadow-sm pointer-events-none">
                {item.category}
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              <Link to={`/books/${item._id || item.id}`} className="hover:text-pink-600 transition-colors">
                <h3 className="font-bold text-lg line-clamp-2 mb-1">{item.title || item.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mb-4">{item.author}</p>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                <div className="font-extrabold text-pink-600 text-lg">{formatCurrency(item.price)}</div>
                <Link 
                  to={`/books/${item._id || item.id}`}
                  className="px-4 py-2 text-sm font-semibold text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors shadow-sm hover:shadow-md inline-block text-center"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {displayedBooks.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No books found in this category.
        </div>
      )}
    </div>
  );
}

export default Freebook;
