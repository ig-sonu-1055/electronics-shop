import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showWishlistMessage, setShowWishlistMessage] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    addToWishlist(product);
    setShowWishlistMessage(true);
    setTimeout(() => setShowWishlistMessage(false), 2000);
  };

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      {/* Added to cart notification */}
      <AnimatePresence>
        {showAddedMessage && (
          <motion.div 
            className="added-notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FiCheck /> Added to Cart!
          </motion.div>
        )}
        {showWishlistMessage && (
          <motion.div 
            className="added-notification wishlist"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FiHeart /> Added to Wishlist!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="product-image-container">
        {discount > 0 && (
          <span className="discount-badge">-{discount}%</span>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
        <div className="product-actions">
          <motion.button 
            className={`action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToWishlist}
            title="Add to Wishlist"
          >
            <FiHeart />
          </motion.button>
          <motion.button 
            className="action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Quick View"
          >
            <FiEye />
          </motion.button>
          <motion.button 
            className={`action-btn ${isInCart(product.id) ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <FiShoppingCart />
          </motion.button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={i < Math.floor(product.rating) ? 'star filled' : 'star'}
              />
            ))}
          </div>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews">({(product.reviews || 0).toLocaleString()} reviews)</span>
        </div>

        <div className="product-pricing">
          <span className="current-price">${product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <motion.button 
          className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
        >
          {isInCart(product.id) ? (
            <><FiCheck /> In Cart</>
          ) : (
            <><FiShoppingCart /> Add to Cart</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
