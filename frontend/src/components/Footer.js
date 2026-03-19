import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend
} from 'react-icons/fi';
import BrandLogo from './BrandLogo';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', path: '/products' },
      { label: 'Smartphones', path: '/products?category=Smartphones' },
      { label: 'Laptops', path: '/products?category=Laptops' },
      { label: 'Headphones', path: '/products?category=Headphones' },
      { label: 'Gaming', path: '/products?category=Gaming' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
      { label: 'Blog', path: '/blog' },
    ],
    support: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQs', path: '/faq' },
      { label: 'Shipping', path: '/shipping' },
      { label: 'Returns', path: '/returns' },
      { label: 'Warranty', path: '/warranty' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: <FiFacebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FiTwitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FiInstagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FiYoutube />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Newsletter Section */}
        <motion.div 
          className="footer-newsletter"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="newsletter-content">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.</p>
          </div>
          <form className="newsletter-form">
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
              />
            </div>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend /> Subscribe
            </motion.button>
          </form>
        </motion.div>

        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <BrandLogo />
            </Link>
            <p className="brand-description">
              Your one-stop destination for premium electronics. We offer the latest gadgets 
              with the best prices and exceptional customer service.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <FiMapPin />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>support@electroshop.com</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links-section">
            <div className="footer-links-column">
              <h4>Shop</h4>
              <ul>
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Company</h4>
              <ul>
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Support</h4>
              <ul>
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Legal</h4>
              <ul>
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} ElectroShop. All rights reserved.
            </p>
            <div className="social-links">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <div className="payment-methods">
              <span>💳</span>
              <span>💰</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
