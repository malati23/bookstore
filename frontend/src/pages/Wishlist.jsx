import React, { useEffect } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';
import WishlistCard from '../components/WishlistCard';
import EmptyWishlist from '../components/EmptyWishlist';

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col pt-16 font-sans">
      <Navebar />
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-screen-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            My Wishlist <span className="text-pink-500">({wishlist.length})</span>
          </h1>
          
          {wishlist.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-red-500 font-bold hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-slate-700"
            >
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {wishlist.map((book) => (
              <WishlistCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
