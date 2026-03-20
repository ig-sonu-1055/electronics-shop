import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiCalendar,
  FiToggleLeft,
  FiToggleRight,
  FiChevronDown,
  FiAlertCircle,
  FiUsers
} from 'react-icons/fi';
import { API_BASE_URL } from '../../utils/apiBase';
import { formatINR } from '../../utils/currency';
import './UserManagement.css';

const API_URL = API_BASE_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      
      if (response.ok) {
        // Map backend data to expected format
        const formattedUsers = data.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || 'Not provided',
          address: user.address || 'Not provided',
          status: user.status || 'active',
          joinDate: user.createdAt,
          orders: user.orderCount || 0,
          totalSpent: user.totalSpent || 0
        }));
        setUsers(formattedUsers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleToggleStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    try {
      await fetch(`${API_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, status: newStatus };
        }
        return u;
      }));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(u => u.id !== userToDelete.id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loader"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-text">
          <h1>User Management</h1>
          <p>Manage registered users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-stats">
        <div className="user-stat-card">
          <div className="stat-icon blue">
            <FiUsers />
          </div>
          <div className="stat-info">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon green">
            <FiUser />
          </div>
          <div className="stat-info">
            <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon orange">
            <FiShoppingBag />
          </div>
          <div className="stat-info">
            <span className="stat-value">{users.reduce((acc, u) => acc + u.orders, 0)}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FiFilter />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <FiChevronDown className="select-arrow" />
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="phone-cell">{user.phone}</td>
                <td className="date-cell">{formatDate(user.joinDate)}</td>
                <td className="orders-cell">{user.orders}</td>
                <td className="spent-cell">{formatINR(user.totalSpent)}</td>
                <td>
                  <span className={getStatusClass(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => handleViewUser(user)}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="toggle-btn"
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteClick(user)}
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <FiUsers />
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* View User Modal */}
      <AnimatePresence>
        {showViewModal && selectedUser && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
          >
            <motion.div 
              className="view-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                <FiX />
              </button>

              <div className="user-profile-header">
                <div className="profile-avatar">
                  {selectedUser.name.charAt(0)}
                </div>
                <h2>{selectedUser.name}</h2>
                <span className={getStatusClass(selectedUser.status)}>
                  {selectedUser.status}
                </span>
              </div>

              <div className="user-info-grid">
                <div className="info-item">
                  <FiMail />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{selectedUser.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiPhone />
                  <div>
                    <span className="info-label">Phone</span>
                    <span className="info-value">{selectedUser.phone}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiMapPin />
                  <div>
                    <span className="info-label">Address</span>
                    <span className="info-value">{selectedUser.address}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiCalendar />
                  <div>
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{formatDate(selectedUser.joinDate)}</span>
                  </div>
                </div>
              </div>

              <div className="user-stats-row">
                <div className="stat-box">
                  <span className="stat-num">{selectedUser.orders}</span>
                  <span className="stat-text">Orders</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">{formatINR(selectedUser.totalSpent)}</span>
                  <span className="stat-text">Total Spent</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">{formatINR(selectedUser.totalSpent / selectedUser.orders || 0)}</span>
                  <span className="stat-text">Avg Order</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div 
              className="confirm-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="confirm-icon">
                <FiAlertCircle />
              </div>
              <h3>Delete User</h3>
              <p>Are you sure you want to delete "{userToDelete?.name}"? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="delete-confirm-btn"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
