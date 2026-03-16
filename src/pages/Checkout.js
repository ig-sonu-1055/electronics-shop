import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiCreditCard, 
  FiCheck, 
  FiLock,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcPaypal, 
  FaApplePay, 
  FaGooglePay,
  FaCcAmex 
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const API_URL = 'http://localhost:5000/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotals, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { subtotal, shipping, tax, total, itemCount } = getCartTotals();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: <FiCreditCard />, description: 'Visa, Mastercard, Amex' },
    { id: 'paypal', name: 'PayPal', icon: <FaCcPaypal />, description: 'Pay with PayPal account' },
    { id: 'apple-pay', name: 'Apple Pay', icon: <FaApplePay />, description: 'Quick and secure' },
    { id: 'google-pay', name: 'Google Pay', icon: <FaGooglePay />, description: 'Fast checkout' }
  ];

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    // Format expiry
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field].trim() !== '');
  };

  const validatePayment = () => {
    if (paymentMethod === 'credit-card') {
      return (
        cardInfo.cardNumber.replace(/\s/g, '').length === 16 &&
        cardInfo.cardName.trim() !== '' &&
        cardInfo.expiry.length === 5 &&
        cardInfo.cvv.length >= 3
      );
    }
    return true; // Other payment methods don't need card validation
  };

  const handleContinue = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) {
      alert('Please fill in all payment details correctly');
      return;
    }

    if (!isAuthenticated || !user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        user: user.id,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
          email: shippingInfo.email
        },
        paymentMethod: paymentMethod,
        paymentStatus: 'paid',
        subtotal: subtotal,
        shippingCost: shipping,
        tax: tax,
        totalAmount: total,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };

      // Send order to backend
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrderId(data.orderNumber || data._id);
      setIsProcessing(false);
      setOrderComplete(true);
      
      // Clear cart after successful order
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      setIsProcessing(false);
      alert('Failed to place order: ' + error.message);
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <Link to="/products" className="back-to-shop-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <motion.div 
          className="order-success"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <div className="success-icon">
            <FiCheck />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: {orderId}</p>
          <p className="success-message">
            Thank you for your purchase! We've sent a confirmation email to {shippingInfo.email}
          </p>
          
          <div className="test-mode-notice">
            <span className="test-badge">TEST MODE</span>
            <p>This is a test transaction. No actual payment was processed.</p>
          </div>

          <div className="order-actions">
            <Link to="/products" className="continue-btn">
              Continue Shopping
            </Link>
            <Link to="/" className="home-btn">
              Go to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/cart" className="back-link">
            <FiArrowLeft /> Back to Cart
          </Link>
          <h1>Checkout</h1>
          
          <div className="test-mode-badge">
            <FiLock /> TEST MODE
          </div>
        </div>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">{step > 1 ? <FiCheck /> : '1'}</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">{step > 2 ? <FiCheck /> : '2'}</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="form-step"
                >
                  <h2><FiMapPin /> Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <div className="input-wrapper">
                        <FiUser />
                        <input
                          type="text"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleShippingChange}
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <div className="input-wrapper">
                        <FiUser />
                        <input
                          type="text"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleShippingChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <div className="input-wrapper">
                        <FiMail />
                        <input
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <div className="input-wrapper">
                        <FiPhone />
                        <input
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Address *</label>
                    <div className="input-wrapper">
                      <FiMapPin />
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        placeholder="New York"
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        placeholder="NY"
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <button 
                    className="continue-step-btn"
                    onClick={handleContinue}
                    disabled={!validateShipping()}
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="form-step"
                >
                  <h2><FiCreditCard /> Payment Method</h2>
                  
                  <div className="test-payment-notice">
                    <FiLock />
                    <span>TEST MODE: Use any test card numbers. No real charges will be made.</span>
                  </div>

                  <div className="payment-methods">
                    {paymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`payment-method-option ${paymentMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="payment-method-icon">{method.icon}</div>
                        <div className="payment-method-info">
                          <h4>{method.name}</h4>
                          <p>{method.description}</p>
                        </div>
                        <div className="payment-method-check">
                          {paymentMethod === method.id && <FiCheck />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === 'credit-card' && (
                    <div className="card-details">
                      <h3>Card Details</h3>
                      <div className="card-icons">
                        <FaCcVisa />
                        <FaCcMastercard />
                        <FaCcAmex />
                      </div>

                      <div className="form-group full-width">
                        <label>Card Number</label>
                        <div className="input-wrapper">
                          <FiCreditCard />
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>
                        <span className="test-hint">Test: 4242 4242 4242 4242</span>
                      </div>

                      <div className="form-group full-width">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardInfo.cardName}
                          onChange={handleCardChange}
                          placeholder="JOHN DOE"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardInfo.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                          />
                          <span className="test-hint">Test: 12/28</span>
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                          />
                          <span className="test-hint">Test: 123</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="alt-payment-info">
                      <FaCcPaypal className="alt-payment-icon paypal" />
                      <p>You will be redirected to PayPal to complete your payment.</p>
                      <span className="test-notice">TEST MODE: Simulated PayPal checkout</span>
                    </div>
                  )}

                  {paymentMethod === 'apple-pay' && (
                    <div className="alt-payment-info">
                      <FaApplePay className="alt-payment-icon apple" />
                      <p>Complete your purchase with Apple Pay.</p>
                      <span className="test-notice">TEST MODE: Simulated Apple Pay</span>
                    </div>
                  )}

                  {paymentMethod === 'google-pay' && (
                    <div className="alt-payment-info">
                      <FaGooglePay className="alt-payment-icon google" />
                      <p>Complete your purchase with Google Pay.</p>
                      <span className="test-notice">TEST MODE: Simulated Google Pay</span>
                    </div>
                  )}

                  <div className="step-buttons">
                    <button className="back-step-btn" onClick={() => setStep(1)}>
                      <FiArrowLeft /> Back
                    </button>
                    <button className="continue-step-btn" onClick={handleContinue}>
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="form-step"
                >
                  <h2><FiCheck /> Review Your Order</h2>

                  <div className="review-section">
                    <h3>Shipping Address</h3>
                    <div className="review-card">
                      <p><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                      <p>{shippingInfo.email}</p>
                      <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="review-card">
                      <div className="review-payment">
                        {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                        <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                        {paymentMethod === 'credit-card' && (
                          <span className="card-last-four">
                            •••• {cardInfo.cardNumber.slice(-4)}
                          </span>
                        )}
                      </div>
                      <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Order Items ({itemCount})</h3>
                    <div className="review-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="review-item">
                          <img src={item.image} alt={item.name} />
                          <div className="review-item-info">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <span className="review-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step-buttons">
                    <button className="back-step-btn" onClick={() => setStep(2)}>
                      <FiArrowLeft /> Back
                    </button>
                    <button 
                      className="place-order-btn"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiLock /> Place Order - ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="order-summary-sidebar">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <span className="summary-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="secure-notice">
              <FiLock /> Secure 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
