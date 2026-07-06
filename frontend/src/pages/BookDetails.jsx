import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook } from '../api/bookApi';
import BookInfo from '../components/BookInfo';
import RelatedBooks from '../components/RelatedBooks';
import ReviewsSection from '../components/ReviewsSection';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

import mockList from '../assets/List.json';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const data = await getBook(id);
        setBook(data);
        setError(null);
      } catch (err) {
        // Fallback: Check if the book exists in our mockList (since we seeded the shop with it)
        const mockBook = mockList.find(b => b.id.toString() === id || (b._id && b._id.toString() === id));
        if (mockBook) {
          setBook(mockBook);
          setError(null);
        } else {
          setError("Book Not Found or an error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fallbackImage = 'https://via.placeholder.com/500x700?text=No+Cover+Available';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col pt-16 font-sans">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12 max-w-screen-xl">
        {loading ? (
          // Skeleton Loader
          <div className="animate-pulse flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[45%] bg-white dark:bg-slate-800 h-[600px] rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700"></div>
            <div className="lg:w-[55%] flex flex-col gap-4 py-4">
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6 mb-8"></div>
              <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ) : error || !book ? (
          // Error / Not Found State
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
            <svg className="h-24 w-24 text-gray-300 dark:text-slate-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Book Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-lg">
              We couldn't find the book you were looking for. It may have been removed or the link might be broken.
            </p>
            <Link 
              to="/Course" 
              className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Back to Shop
            </Link>
          </div>
        ) : (
          // Success State
          <div className="animate-fadeIn">
            {/* Breadcrumb Navigation */}
            <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2 font-medium">
              <Link to="/" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              <Link to="/Course" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Shop</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              <span className="text-gray-400 dark:text-gray-500">{book.category}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              <span className="text-gray-800 dark:text-gray-200 truncate">{book.title}</span>
            </nav>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 mb-16">
              
              {/* Left Side: 45% Image Container */}
              <div className="lg:w-[45%] flex justify-center lg:justify-end items-start">
                <div className="relative group w-full max-w-[500px]">
                  {/* Decorative background blur */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-pink-100 to-blue-50 dark:from-pink-900 dark:to-blue-900 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-500"></div>
                  
                  <div className="relative bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                      className="w-full h-auto object-contain rounded-xl shadow-md transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Side: 55% Book Info */}
              <div className="lg:w-[55%]">
                <BookInfo book={book} />
              </div>
              
            </div>
            
            {/* Reviews Section */}
            <div className="mt-16">
              <ReviewsSection bookId={book._id} />
            </div>
            
            {/* Related Books */}
            <div className="mt-16 pt-16 border-t border-gray-200 dark:border-slate-800">
              <RelatedBooks currentBookId={book._id} category={book.category} />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetails;
