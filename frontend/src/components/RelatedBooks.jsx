import React, { useState, useEffect } from 'react';
import { getBooks } from '../api/bookApi';
import BookCard from './BookCard';

const RelatedBooks = ({ currentBookId, category }) => {
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Fetch all books
        const allBooks = await getBooks();
        
        // Filter to match category, exclude current book, and take top 4
        const filtered = allBooks
          .filter(book => book.category === category && book._id !== currentBookId)
          .slice(0, 4);
          
        setRelatedBooks(filtered);
      } catch (error) {
        console.error("Failed to fetch related books", error);
      } finally {
        setLoading(false);
      }
    };

    if (category && currentBookId) {
      fetchRelated();
    }
  }, [category, currentBookId]);

  if (loading) {
    return (
      <div className="mt-16 py-10">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (relatedBooks.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-gray-200 dark:border-slate-700">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
        Related Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedBooks.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RelatedBooks;
