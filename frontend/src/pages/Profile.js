import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit2, 
  FiSave,
  FiPackage,
  FiHeart,
  FiSettings,
  FiCreditCard,
  FiBell,
  FiShield,
  FiLogOut,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFileText,
  FiX,
  FiDownload,
  FiMoon,
  FiSun,
  FiGlobe,
  FiDollarSign,
  FiTrash2,
  FiEye,
  FiLock,
  FiToggleLeft,
  FiToggleRight,
  FiAlertTriangle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../utils/apiBase';
import './Profile.css';

const API_URL = API_BASE_URL;

const Profile = () => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const { wishlistItems, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      language: 'en',
      currency: 'USD',
      emailNotifications: true,
      orderUpdates: true,
      promotionalEmails: false,
      twoFactorAuth: false,
      showOnlineStatus: true,
      dataSharing: false
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSuccessMessage('Settings updated!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would call an API to delete the account
    setShowDeleteModal(false);
    setSuccessMessage('Account deletion request submitted. You will receive a confirmation email.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoadingOrders(true);
    try {
      const response = await fetch(`${API_URL}/orders/user/${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data);
        // Calculate total spent
        const spent = data.reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalSpent(spent);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoadingOrders(false);
  };

  // Fetch orders when component mounts or user changes
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setSuccessMessage(result.message || 'Failed to update profile');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FiCheckCircle />;
      case 'processing': return <FiClock />;
      case 'shipped': return <FiTruck />;
      case 'out-for-delivery': return <FiTruck />;
      case 'delivered': return <FiCheckCircle />;
      case 'cancelled': return <FiXCircle />;
      default: return <FiClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'out-for-delivery': return 'out-for-delivery';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Reorder function - adds all items from an order to the cart
  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image
      }, item.quantity);
    });
    setSuccessMessage('Items added to your cart!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Generate invoice
  const handleInvoice = (order) => {
    const invoiceContent = `
========================================
            INVOICE
========================================
Order Number: ${order.orderNumber}
Date: ${formatDate(order.createdAt)}
Status: ${order.status.toUpperCase()}
----------------------------------------

Customer Information:
Name: ${user?.name || 'N/A'}
Email: ${user?.email || 'N/A'}
Phone: ${order.shippingAddress?.phone || user?.phone || 'N/A'}

Shipping Address:
${order.shippingAddress?.fullName || user?.name || 'N/A'}
${order.shippingAddress?.street || 'N/A'}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}
${order.shippingAddress?.country || ''}

----------------------------------------
Items:
----------------------------------------
${order.items.map(item => 
  `${item.name}\n  Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
).join('\n\n')}

----------------------------------------
Subtotal: $${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
Shipping: $${(order.shippingCost || 0).toFixed(2)}
Tax: $${(order.taxAmount || 0).toFixed(2)}
----------------------------------------
TOTAL: $${order.totalAmount.toFixed(2)}
========================================

Payment Method: ${order.paymentMethod || 'N/A'}
Payment Status: ${order.paymentStatus || 'Paid'}

Thank you for your purchase!
========================================
    `;

    // Create and download the invoice as a text file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setSuccessMessage('Invoice downloaded!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <FiUser /> },
    { id: 'orders', label: 'My Orders', icon: <FiPackage /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
    { id: 'payments', label: 'Payment Methods', icon: <FiCreditCard /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="user-avatar-profile">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <nav className="profile-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <button className="nav-item logout" onClick={logout}>
              <FiLogOut />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-content">
          {successMessage && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {successMessage}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              className="profile-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing ? (
                  <motion.button 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit2 /> Edit Profile
                  </motion.button>
                ) : (
                  <motion.button 
                    className="save-btn"
                    onClick={handleSave}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSave /> Save Changes
                  </motion.button>
                )}
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                      <FiPhone className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={isEditing ? 'Enter phone number' : 'Not provided'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <div className="input-wrapper">
                      <FiMapPin className="input-icon" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={isEditing ? 'Enter address' : 'Not provided'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="account-stats">
                <div className="stat-card">
                  <FiPackage />
                  <div className="stat-info">
                    <h4>{orders.length}</h4>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FiHeart />
                  <div className="stat-info">
                    <h4>{wishlistItems?.length || 0}</h4>
                    <p>Wishlist Items</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FiCreditCard />
                  <div className="stat-info">
                    <h4>${totalSpent.toLocaleString()}</h4>
                    <p>Total Spent</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              className="orders-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>My Orders</h2>
                <button className="refresh-btn" onClick={fetchOrders}>
                  Refresh
                </button>
              </div>

              {loadingOrders ? (
                <div className="loading-orders">
                  <div className="spinner"></div>
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <FiPackage />
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <motion.div 
                      key={order._id} 
                      className="order-card"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="order-header">
                        <div className="order-info">
                          <h4>#{order.orderNumber}</h4>
                          <p>Placed on {formatDate(order.createdAt)}</p>
                        </div>
                        <div className={`order-status ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty">Qty: {item.quantity}</span>
                            </div>
                            <span className="item-price">${item.price}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="more-items">+{order.items.length - 3} more items</p>
                        )}
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          <span>Total:</span>
                          <strong>${order.totalAmount.toLocaleString()}</strong>
                        </div>
                        <div className="order-actions">
                          {order.status === 'delivered' && (
                            <button 
                              className="reorder-btn"
                              onClick={() => handleReorder(order)}
                            >
                              Reorder
                            </button>
                          )}
                          <button 
                            className="invoice-btn"
                            onClick={() => handleInvoice(order)}
                          >
                            <FiFileText /> Invoice
                          </button>
                          <button 
                            className="view-order-btn"
                            onClick={() => handleViewDetails(order)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="delivery-info">
                          <FiTruck />
                          <span>Estimated delivery: {formatDate(order.estimatedDelivery)}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div 
              className="wishlist-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>My Wishlist</h2>
              </div>
              <div className="empty-state">
                <FiHeart />
                <h3>Your wishlist is empty</h3>
                <p>Save items you love to your wishlist</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div 
              className="payments-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>Payment Methods</h2>
                <button className="add-btn">+ Add New</button>
              </div>
              <div className="payment-cards">
                <div className="payment-card">
                  <div className="card-icon">💳</div>
                  <div className="card-info">
                    <h4>Visa ending in 4242</h4>
                    <p>Expires 12/2026</p>
                  </div>
                  <span className="default-badge">Default</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div 
              className="notifications-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>Notification Preferences</h2>
              </div>
              
              <div className="settings-group">
                <div className="settings-item">
                  <div className="setting-info">
                    <FiMail />
                    <div>
                      <h4>Email Notifications</h4>
                      <p>Receive important updates via email</p>
                    </div>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.emailNotifications ? 'active' : ''}`}
                    onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                  >
                    {settings.emailNotifications ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="settings-item">
                  <div className="setting-info">
                    <FiPackage />
                    <div>
                      <h4>Order Updates</h4>
                      <p>Get notified about order status changes</p>
                    </div>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.orderUpdates ? 'active' : ''}`}
                    onClick={() => updateSetting('orderUpdates', !settings.orderUpdates)}
                  >
                    {settings.orderUpdates ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="settings-item">
                  <div className="setting-info">
                    <FiBell />
                    <div>
                      <h4>Promotional Emails</h4>
                      <p>Receive deals, offers and product recommendations</p>
                    </div>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.promotionalEmails ? 'active' : ''}`}
                    onClick={() => updateSetting('promotionalEmails', !settings.promotionalEmails)}
                  >
                    {settings.promotionalEmails ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              className="security-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>Security Settings</h2>
              </div>
              
              <div className="settings-group">
                <div className="settings-item">
                  <div className="setting-info">
                    <FiLock />
                    <div>
                      <h4>Change Password</h4>
                      <p>Update your account password</p>
                    </div>
                  </div>
                  <button className="action-btn">Change</button>
                </div>

                <div className="settings-item">
                  <div className="setting-info">
                    <FiShield />
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.twoFactorAuth ? 'active' : ''}`}
                    onClick={() => updateSetting('twoFactorAuth', !settings.twoFactorAuth)}
                  >
                    {settings.twoFactorAuth ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="settings-item">
                  <div className="setting-info">
                    <FiEye />
                    <div>
                      <h4>Login History</h4>
                      <p>View your recent login activity</p>
                    </div>
                  </div>
                  <button className="action-btn">View</button>
                </div>
              </div>

              <div className="security-info-card">
                <FiCheckCircle />
                <div>
                  <h4>Your account is secure</h4>
                  <p>Last password change: 30 days ago</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              className="settings-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>
              
              {/* Appearance Settings */}
              <div className="settings-category">
                <h3>Appearance</h3>
                <div className="settings-group">
                  <div className="settings-item">
                    <div className="setting-info">
                      {settings.theme === 'dark' ? <FiMoon /> : <FiSun />}
                      <div>
                        <h4>Theme</h4>
                        <p>Choose your preferred theme</p>
                      </div>
                    </div>
                    <div className="theme-selector">
                      <button 
                        className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                        onClick={() => updateSetting('theme', 'light')}
                      >
                        <FiSun /> Light
                      </button>
                      <button 
                        className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                        onClick={() => updateSetting('theme', 'dark')}
                      >
                        <FiMoon /> Dark
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="settings-category">
                <h3>Regional</h3>
                <div className="settings-group">
                  <div className="settings-item">
                    <div className="setting-info">
                      <FiGlobe />
                      <div>
                        <h4>Language</h4>
                        <p>Select your preferred language</p>
                      </div>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>

                  <div className="settings-item">
                    <div className="setting-info">
                      <FiDollarSign />
                      <div>
                        <h4>Currency</h4>
                        <p>Select your preferred currency</p>
                      </div>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="AUD">AUD ($)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="settings-category">
                <h3>Privacy</h3>
                <div className="settings-group">
                  <div className="settings-item">
                    <div className="setting-info">
                      <FiEye />
                      <div>
                        <h4>Show Online Status</h4>
                        <p>Let others see when you're online</p>
                      </div>
                    </div>
                    <button 
                      className={`toggle-btn ${settings.showOnlineStatus ? 'active' : ''}`}
                      onClick={() => updateSetting('showOnlineStatus', !settings.showOnlineStatus)}
                    >
                      {settings.showOnlineStatus ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                  </div>

                  <div className="settings-item">
                    <div className="setting-info">
                      <FiShield />
                      <div>
                        <h4>Data Sharing</h4>
                        <p>Share usage data to help improve our services</p>
                      </div>
                    </div>
                    <button 
                      className={`toggle-btn ${settings.dataSharing ? 'active' : ''}`}
                      onClick={() => updateSetting('dataSharing', !settings.dataSharing)}
                    >
                      {settings.dataSharing ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                  </div>

                  <div className="settings-item">
                    <div className="setting-info">
                      <FiDownload />
                      <div>
                        <h4>Download My Data</h4>
                        <p>Get a copy of all your personal data</p>
                      </div>
                    </div>
                    <button className="action-btn">Download</button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="settings-category danger-zone">
                <h3>Danger Zone</h3>
                <div className="settings-group">
                  <div className="settings-item danger">
                    <div className="setting-info">
                      <FiTrash2 />
                      <div>
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <motion.div 
            className="order-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="close-modal-btn" onClick={() => setShowOrderModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-order-info">
                <div className="order-detail-row">
                  <span>Order Number:</span>
                  <strong>#{selectedOrder.orderNumber}</strong>
                </div>
                <div className="order-detail-row">
                  <span>Date:</span>
                  <strong>{formatDate(selectedOrder.createdAt)}</strong>
                </div>
                <div className="order-detail-row">
                  <span>Status:</span>
                  <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="modal-shipping-info">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress?.fullName || user?.name}</p>
                <p>{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                <p>
                  {selectedOrder.shippingAddress?.city || ''}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zipCode || ''}
                </p>
                <p>{selectedOrder.shippingAddress?.country || ''}</p>
                <p>Phone: {selectedOrder.shippingAddress?.phone || user?.phone || 'N/A'}</p>
              </div>

              <div className="modal-items">
                <h4>Items</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="modal-item">
                    <img src={item.image} alt={item.name} />
                    <div className="modal-item-details">
                      <span className="modal-item-name">{item.name}</span>
                      <span className="modal-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="modal-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="modal-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>${(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${(selectedOrder.taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <strong>${selectedOrder.totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="modal-reorder-btn"
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setShowOrderModal(false);
                  }}
                >
                  <FiPackage /> Reorder
                </button>
                <button 
                  className="modal-invoice-btn"
                  onClick={() => handleInvoice(selectedOrder)}
                >
                  <FiDownload /> Download Invoice
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="order-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div 
            className="delete-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Account?</h3>
            <p>This action cannot be undone. All your data, orders, and preferences will be permanently deleted.</p>
            <div className="delete-modal-actions">
              <button 
                className="cancel-delete-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDeleteAccount}
              >
                Yes, Delete My Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
