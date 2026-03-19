import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, 
  FiPackage, 
  FiUsers, 
  FiShoppingBag, 
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser
} from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import BrandLogo from '../../components/BrandLogo';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { admin, isAuthenticated, loading, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render admin panel if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/products', icon: FiPackage, label: 'Products' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="admin-logo">
            <BrandLogo
              markClassName="logo-icon"
              text="ElectroAdmin"
              textClassName="admin-logo-text"
            />
          </Link>
          <button 
            className="mobile-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon />
              {sidebarOpen && <span>{item.label}</span>}
              {isActive(item.path) && (
                <motion.div 
                  className="active-indicator"
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle desktop-only"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
            <button 
              className="sidebar-toggle mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu />
            </button>
            <div className="search-box">
              <FiSearch />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>

            <div className="user-dropdown">
              <button 
                className="user-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-avatar">
                  <FiUser />
                </div>
                <div className="user-info">
                  <span className="user-name">{admin?.name || 'Admin'}</span>
                  <span className="user-role">Administrator</span>
                </div>
                <FiChevronDown className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div 
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link to="/admin/settings" className="dropdown-item">
                      <FiSettings />
                      <span>Settings</span>
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
