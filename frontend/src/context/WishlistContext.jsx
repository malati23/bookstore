import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Failed to parse wishlist from local storage", error);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (book) => {
    setWishlist((prev) => {
      // Prevent duplicates
      const exists = prev.find((item) => item._id === book._id);
      if (exists) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== bookId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistItems: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
