import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      setSuccess('Signed in successfully. Redirecting...');
      setTimeout(() => navigate('/'), 900);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Form */}
        <motion.div 
          className="auth-form-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="auth-form-wrapper">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link to="/" className="auth-logo">
                <BrandLogo textClassName="auth-logo-text" />
              </Link>
            </motion.div>

            <motion.div 
              className="auth-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="welcome-text">Welcome back</p>
              <h1>Sign in</h1>
            </motion.div>

            {error && (
              <motion.div 
                className="auth-error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FiAlertCircle />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                className="auth-success-toast"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiCheckCircle />
                <span>{success}</span>
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit} 
              className="auth-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="test1@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password ?
                  </Link>
                </div>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                className="auth-submit-btn"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0, 212, 255, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    SIGN IN
                    <FiArrowRight className="btn-arrow" />
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.p 
              className="auth-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              I don't have an account ? <Link to="/register">Sign up</Link>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Illustration */}
        <motion.div 
          className="auth-illustration"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="illustration-content">
            <span className="visual-badge">Member Access</span>
            <h2>Power your shopping journey</h2>
            <p>Sign in to manage carts, orders, and personalized tech deals in one place.</p>

            <div className="visual-panel">
              <div className="visual-row">
                <span>Saved Products</span>
                <strong>124</strong>
              </div>
              <div className="visual-row">
                <span>Fast Checkout</span>
                <strong>Enabled</strong>
              </div>
              <div className="visual-row">
                <span>Order Tracking</span>
                <strong>Live</strong>
              </div>
            </div>

            <motion.div 
              className="deco-circle deco-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            />
            <motion.div 
              className="deco-circle deco-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
