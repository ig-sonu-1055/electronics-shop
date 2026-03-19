import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts, categories as initialCategories } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = initialCategories;

  useEffect(() => {
    // Load products from localStorage or use initial data
    const savedProducts = localStorage.getItem('storeProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('storeProducts', JSON.stringify(initialProducts));
    }
    setLoading(false);
  }, []);

  // Save products to localStorage whenever they change
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('storeProducts', JSON.stringify(newProducts));
  };

  // Add a new product
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price) * 1.1,
      stock: parseInt(productData.stock) || 50,
      rating: parseFloat(productData.rating) || 4.5,
      reviews: parseInt(productData.reviews) || 0,
      inStock: parseInt(productData.stock) > 0,
      featured: productData.featured || false
    };
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    return newProduct;
  };

  // Update an existing product
  const updateProduct = (productId, productData) => {
    const updatedProducts = products.map(p => 
      p.id === productId 
        ? { 
            ...p, 
            ...productData, 
            price: parseFloat(productData.price),
            originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price) * 1.1,
            stock: parseInt(productData.stock) || 0,
            rating: parseFloat(productData.rating) || p.rating,
            inStock: parseInt(productData.stock) > 0
          } 
        : p
    );
    saveProducts(updatedProducts);
  };

  // Delete a product
  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);
  };

  // Get a single product by ID
  const getProductById = (productId) => {
    return products.find(p => p.id === productId);
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return products.filter(p => p.featured);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (!category || category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  // Reset to initial products (for testing)
  const resetProducts = () => {
    saveProducts(initialProducts);
  };

  const value = {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    resetProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
