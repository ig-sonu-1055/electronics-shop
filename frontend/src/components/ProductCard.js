import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showWishlistMessage, setShowWishlistMessage] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
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

  const handleQuickViewOpen = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleQuickViewClose = () => {
    setShowQuickView(false);
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
            onClick={handleQuickViewOpen}
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
          <span className="current-price">{formatINR(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">{formatINR(product.originalPrice)}</span>
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

      <AnimatePresence>
        {showQuickView && (
          <motion.div
            className="quick-view-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleQuickViewClose}
          >
            <motion.div
              className="quick-view-modal"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="quick-view-close" onClick={handleQuickViewClose}>
                <FiX />
              </button>

              <div className="quick-view-content">
                <div className="quick-view-image-wrap">
                  <img src={product.image} alt={product.name} className="quick-view-image" />
                </div>

                <div className="quick-view-details">
                  <span className="quick-view-category">{product.category}</span>
                  <h3>{product.name}</h3>

                  <div className="quick-view-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < Math.floor(product.rating) ? 'star filled' : 'star'}
                        />
                      ))}
                    </div>
                    <span>{product.rating} ({(product.reviews || 0).toLocaleString()} reviews)</span>
                  </div>

                  <p className="quick-view-description">
                    {product.description || 'Premium product with high-quality build and excellent performance.'}
                  </p>

                  <div className="quick-view-pricing">
                    <span className="quick-current-price">{formatINR(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="quick-original-price">{formatINR(product.originalPrice)}</span>
                    )}
                  </div>

                  <div className="quick-view-actions">
                    <button
                      className={`quick-add-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                      onClick={handleAddToCart}
                    >
                      {isInCart(product.id) ? (<><FiCheck /> In Cart</>) : (<><FiShoppingCart /> Add to Cart</>)}
                    </button>
                    <button
                      className={`quick-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={handleAddToWishlist}
                    >
                      <FiHeart /> Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
