import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiUser, 
  FiShoppingCart, 
  FiHeart, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiSettings,
  FiPackage
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BrandLogo from './BrandLogo';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems, wishlistItems, getCartTotals } = useCart();
  const navigate = useNavigate();

  const { itemCount } = getCartTotals();
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="logo-wrapper"
          >
            <BrandLogo />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={link.path} className="nav-link">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
                className="search-form"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </motion.form>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="icon-btn search-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FiSearch />
          </motion.button>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          <Link to="/cart" className="icon-link">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="icon-btn"
            >
              <FiHeart />
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </motion.div>
          </Link>

          <Link to="/cart" className="icon-link">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="icon-btn"
            >
              <FiShoppingCart />
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </motion.div>
          </Link>

          {/* User Menu */}
          <div className="user-menu-container">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="icon-btn user-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {isAuthenticated ? (
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              ) : (
                <FiUser />
              )}
            </motion.button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="user-dropdown"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user?.name}</span>
                          <span className="user-email">{user?.email}</span>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser /> My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiPackage /> My Orders
                      </Link>
                      <Link 
                        to="/settings" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings /> Settings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <FiLogOut /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser /> Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings /> Register
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
          >
            <form onSubmit={handleSearch} className="mobile-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <FiSearch />
              </button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/cart"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiShoppingCart /> Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  className="mobile-nav-link logout"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
