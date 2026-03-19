import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotals,
    wishlistItems,
    moveToCart,
    removeFromWishlist
  } = useCart();

  const { subtotal, shipping, tax, total, itemCount } = getCartTotals();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="empty-cart-icon"
          >
            <FiShoppingBag />
          </motion.div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>

          {wishlistItems.length > 0 && (
            <div className="wishlist-section">
              <h3><FiHeart /> Your Wishlist ({wishlistItems.length})</h3>
              <div className="wishlist-items">
                {wishlistItems.map(item => (
                  <motion.div
                    key={item.id}
                    className="wishlist-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="wishlist-item-info">
                      <h4>{item.name}</h4>
                      <p className="wishlist-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="wishlist-actions">
                      <button 
                        className="move-to-cart-btn"
                        onClick={() => moveToCart(item.id)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="remove-wishlist-btn"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <Link to="/products" className="back-link">
            <FiArrowLeft /> Continue Shopping
          </Link>
          <h1>Shopping Cart ({itemCount} items)</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <span className="item-total-label">Total</span>
                    <span className="item-total-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            {subtotal >= 100 && (
              <div className="free-shipping-banner">
                🎉 You qualify for FREE shipping!
              </div>
            )}

            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="secure-checkout">
              <span>🔒 Secure Checkout</span>
              <div className="payment-icons">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {wishlistItems.length > 0 && (
          <div className="wishlist-section-full">
            <h3><FiHeart /> Your Wishlist ({wishlistItems.length})</h3>
            <div className="wishlist-grid">
              {wishlistItems.map(item => (
                <motion.div
                  key={item.id}
                  className="wishlist-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="wishlist-card-info">
                    <h4>{item.name}</h4>
                    <p className="wishlist-price">${item.price.toFixed(2)}</p>
                    <div className="wishlist-card-actions">
                      <button 
                        className="move-to-cart-btn"
                        onClick={() => moveToCart(item.id)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="remove-wishlist-btn"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
