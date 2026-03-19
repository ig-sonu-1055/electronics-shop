import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter,
  FiEye,
  FiX,
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiChevronDown,
  FiMapPin,
  FiUser,
  FiPhone,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi';
import './OrderManagement.css';

const API_URL = 'http://localhost:5000/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      
      if (response.ok) {
        // Map backend data to expected format
        const formattedOrders = data.map(order => ({
          id: order.orderNumber || order._id,
          _id: order._id,
          customer: {
            name: order.shippingAddress?.fullName || 'Unknown',
            email: order.shippingAddress?.email || 'N/A',
            phone: order.shippingAddress?.phone || 'N/A'
          },
          items: order.items || [],
          total: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingAddress: `${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}`,
          createdAt: order.createdAt,
          tracking: order.trackingNumber || null
        }));
        setOrders(formattedOrders);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    try {
      const response = await fetch(`${API_URL}/orders/${order._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(o => {
          if (o.id === orderId) {
            return { ...o, status: newStatus };
          }
          return o;
        }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'processing': return <FiPackage />;
      case 'shipped': return <FiTruck />;
      case 'delivered': return <FiCheck />;
      case 'cancelled': return <FiX />;
      default: return <FiClock />;
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'payment-badge paid';
      case 'pending': return 'payment-badge pending';
      case 'refunded': return 'payment-badge refunded';
      default: return 'payment-badge';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loader"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <div className="header-text">
          <h1>Order Management</h1>
          <p>Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="order-stats">
        <div className="order-stat-card">
          <div className="stat-icon blue">
            <FiShoppingBag />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="stat-icon yellow">
            <FiClock />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="stat-icon purple">
            <FiTruck />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.shipped}</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
        <div className="order-stat-card">
          <div className="stat-icon green">
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <span className="stat-value">${stats.revenue.toLocaleString()}</span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search orders..."
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
            {statusOptions.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <FiChevronDown className="select-arrow" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="order-id-cell">{order.id}</td>
                <td>
                  <div className="customer-cell">
                    <span className="customer-name">{order.customer.name}</span>
                    <span className="customer-email">{order.customer.email}</span>
                  </div>
                </td>
                <td className="items-cell">{order.items.length} item(s)</td>
                <td className="total-cell">${order.total.toLocaleString()}</td>
                <td>
                  <span className={getPaymentStatusClass(order.paymentStatus)}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="status-select-wrapper">
                    <div className={`status-icon ${order.status}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`status-select ${order.status}`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="status-arrow" />
                  </div>
                </td>
                <td className="date-cell">{formatDate(order.createdAt)}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FiEye />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-results">
            <FiShoppingBag />
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {showViewModal && selectedOrder && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
          >
            <motion.div 
              className="order-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2>{selectedOrder.id}</h2>
                  <span className={`order-status-badge ${selectedOrder.status}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <button className="close-modal" onClick={() => setShowViewModal(false)}>
                  <FiX />
                </button>
              </div>

              <div className="order-details-grid">
                {/* Customer Info */}
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-item">
                    <FiUser />
                    <div>
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{selectedOrder.customer.name}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiPhone />
                    <div>
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{selectedOrder.customer.phone}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiMapPin />
                    <div>
                      <span className="detail-label">Shipping Address</span>
                      <span className="detail-value">{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <div className="detail-item">
                    <FiCalendar />
                    <div>
                      <span className="detail-label">Order Date</span>
                      <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiDollarSign />
                    <div>
                      <span className="detail-label">Payment Status</span>
                      <span className={`detail-value ${selectedOrder.paymentStatus}`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  {selectedOrder.tracking && (
                    <div className="detail-item">
                      <FiTruck />
                      <div>
                        <span className="detail-label">Tracking Number</span>
                        <span className="detail-value tracking">{selectedOrder.tracking}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                      <span className="item-price">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span className="total-amount">${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;
