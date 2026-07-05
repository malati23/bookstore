import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Load cart items from Local Storage on page refresh
  const [cart, setCart] = useState(() => {
    try {
      const item = window.localStorage.getItem('cart');
      if (item) {
        const parsed = JSON.parse(item);
        // Ensure it's an array to prevent crashes
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
      return [];
    }
  });

  // 2. Save cart items to Local Storage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  // 3. addToCart()
  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === book._id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item is new, add it with quantity 1
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };

  // 4. removeFromCart()
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // 5. updateQuantity()
  const updateQuantity = (id, amount) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (item._id === id) {
          const newQuantity = Math.max(1, item.quantity + amount); // Prevent going below 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // 6. clearCart()
  const clearCart = () => {
    setCart([]);
  };

  // Extra helpers for calculating totals safely
  const totalItems = Array.isArray(cart) ? cart.reduce((total, item) => total + (item?.quantity || 0), 0) : 0;
  const totalPrice = Array.isArray(cart) ? cart.reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 0)), 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
