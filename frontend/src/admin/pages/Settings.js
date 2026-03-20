import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiShield, 
  FiSave,
  FiMail,
  FiLock,
  FiGlobe,
  FiToggleRight,
  FiToggleLeft
} from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    name: 'Admin User',
    email: 'admin@sjelectro.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    orderAlerts: true,
    stockAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    sessionTimeout: '30'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = () => {
    alert('Profile settings saved!');
  };

  const handleSavePassword = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
  };

  const handleSaveNotifications = () => {
    alert('Notification preferences saved!');
  };

  const handleSaveSecurity = () => {
    alert('Security settings saved!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Settings</h1>
          <p>Manage your account settings</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              className="settings-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <FiUser />
                <div>
                  <h2>Profile Information</h2>
                  <p>Update your account details</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <FiUser />
                    <input
                      type="text"
                      name="name"
                      value={settings.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <FiMail />
                    <input
                      type="email"
                      name="email"
                      value={settings.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="section-divider"></div>

              <div className="section-header">
                <FiLock />
                <div>
                  <h2>Change Password</h2>
                  <p>Update your password regularly for security</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-wrapper">
                    <FiLock />
                    <input
                      type="password"
                      name="currentPassword"
                      value={settings.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <FiLock />
                    <input
                      type="password"
                      name="newPassword"
                      value={settings.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-wrapper">
                    <FiLock />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <button className="save-btn" onClick={handleSaveProfile}>
                <FiSave /> Save Changes
              </button>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              className="settings-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <FiBell />
                <div>
                  <h2>Notification Preferences</h2>
                  <p>Choose what notifications you receive</p>
                </div>
              </div>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">Email Notifications</span>
                    <span className="toggle-desc">Receive notifications via email</span>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.emailNotifications ? 'active' : ''}`}
                    onClick={() => handleToggle('emailNotifications')}
                  >
                    {settings.emailNotifications ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">Order Alerts</span>
                    <span className="toggle-desc">Get notified about new orders</span>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.orderAlerts ? 'active' : ''}`}
                    onClick={() => handleToggle('orderAlerts')}
                  >
                    {settings.orderAlerts ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">Low Stock Alerts</span>
                    <span className="toggle-desc">Notify when product stock is low</span>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.stockAlerts ? 'active' : ''}`}
                    onClick={() => handleToggle('stockAlerts')}
                  >
                    {settings.stockAlerts ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">Marketing Emails</span>
                    <span className="toggle-desc">Receive promotional emails</span>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.marketingEmails ? 'active' : ''}`}
                    onClick={() => handleToggle('marketingEmails')}
                  >
                    {settings.marketingEmails ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
              </div>

              <button className="save-btn" onClick={handleSaveNotifications}>
                <FiSave /> Save Preferences
              </button>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              className="settings-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-header">
                <FiShield />
                <div>
                  <h2>Security Settings</h2>
                  <p>Manage your account security</p>
                </div>
              </div>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">Two-Factor Authentication</span>
                    <span className="toggle-desc">Add an extra layer of security</span>
                  </div>
                  <button 
                    className={`toggle-btn ${settings.twoFactorAuth ? 'active' : ''}`}
                    onClick={() => handleToggle('twoFactorAuth')}
                  >
                    {settings.twoFactorAuth ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
              </div>

              <div className="form-group session-timeout">
                <label>Session Timeout (minutes)</label>
                <select
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleInputChange}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <button className="save-btn" onClick={handleSaveSecurity}>
                <FiSave /> Save Settings
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
