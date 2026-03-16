import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('electronicsShopCart');
    const savedWishlist = localStorage.getItem('electronicsShopWishlist');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('electronicsShopCart', JSON.stringify(items));
  };

  // Save wishlist to localStorage
  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('electronicsShopWishlist', JSON.stringify(items));
  };

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity
      };
      saveCart([...cartItems, newItem]);
    }
    return true;
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    saveCart(updatedItems);
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    );
    saveCart(updatedItems);
  };

  // Clear cart
  const clearCart = () => {
    saveCart([]);
  };

  // Add to wishlist
  const addToWishlist = (product) => {
    const exists = wishlistItems.find(item => item.id === product.id);
    if (!exists) {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category
      };
      saveWishlist([...wishlistItems, newItem]);
      return true;
    }
    return false;
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    saveWishlist(updatedItems);
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Get cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const originalTotal = cartItems.reduce((total, item) => total + ((item.originalPrice || item.price) * item.quantity), 0);
    const savings = originalTotal - subtotal;
    const shipping = subtotal > 99 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      originalTotal,
      savings,
      shipping,
      tax,
      total,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    };
  };

  // Move wishlist item to cart
  const moveToCart = (productId) => {
    const item = wishlistItems.find(item => item.id === productId);
    if (item) {
      addToCart(item);
      removeFromWishlist(productId);
    }
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInCart,
    getCartTotals,
    moveToCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
