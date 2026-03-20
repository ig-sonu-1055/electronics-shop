import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, moveToCart, removeFromWishlist } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <FiHeart className="wishlist-empty-icon" />
            <h1>Your wishlist is empty</h1>
            <p>Save products you like and find them quickly here.</p>
            <Link to="/products" className="wishlist-browse-btn">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <Link to="/products" className="wishlist-back-link">
            <FiArrowLeft /> Continue Shopping
          </Link>
          <h1>
            <FiHeart /> Wishlist ({wishlistItems.length})
          </h1>
        </div>

        <div className="wishlist-grid-page">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card-page">
              <div className="wishlist-image-wrap">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="wishlist-details">
                <p className="wishlist-category">{item.category}</p>
                <h3>{item.name}</h3>
                <p className="wishlist-price">{formatINR(item.price)}</p>
                <div className="wishlist-actions">
                  <button
                    className="wishlist-add-cart"
                    onClick={() => moveToCart(item.id)}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button
                    className="wishlist-remove"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
