import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiEye,
  FiClock,
  FiCheck,
  FiTruck
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: [],
    monthlySales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulated data - replace with actual API call
      // const response = await adminAPI.getDashboardStats();
      // setStats(response.data);
      
      // Mock data for demonstration
      setStats({
        totalProducts: 156,
        totalUsers: 2847,
        totalOrders: 1234,
        totalRevenue: 89567,
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'delivered', date: '2024-01-15' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 549.00, status: 'shipped', date: '2024-01-15' },
          { id: 'ORD-003', customer: 'Mike Johnson', amount: 125.50, status: 'processing', date: '2024-01-14' },
          { id: 'ORD-004', customer: 'Sarah Wilson', amount: 899.00, status: 'pending', date: '2024-01-14' },
          { id: 'ORD-005', customer: 'Chris Brown', amount: 199.99, status: 'delivered', date: '2024-01-13' },
        ],
        recentUsers: [
          { id: 1, name: 'Emma Thompson', email: 'emma@example.com', joinDate: '2024-01-15', orders: 5 },
          { id: 2, name: 'David Lee', email: 'david@example.com', joinDate: '2024-01-14', orders: 2 },
          { id: 3, name: 'Lisa Anderson', email: 'lisa@example.com', joinDate: '2024-01-13', orders: 8 },
          { id: 4, name: 'Tom Harris', email: 'tom@example.com', joinDate: '2024-01-12', orders: 1 },
        ],
        monthlySales: [
          { month: 'Jan', sales: 12500 },
          { month: 'Feb', sales: 15800 },
          { month: 'Mar', sales: 14200 },
          { month: 'Apr', sales: 18900 },
          { month: 'May', sales: 21500 },
          { month: 'Jun', sales: 19800 },
        ]
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: FiPackage, 
      change: '+12%',
      trend: 'up',
      color: '#3b82f6'
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: FiUsers, 
      change: '+8%',
      trend: 'up',
      color: '#8b5cf6'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders.toLocaleString(), 
      icon: FiShoppingBag, 
      change: '+23%',
      trend: 'up',
      color: '#10b981'
    },
    { 
      title: 'Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: FiDollarSign, 
      change: '+15%',
      trend: 'up',
      color: '#ff6b00'
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'processing': return <FiPackage />;
      case 'shipped': return <FiTruck />;
      case 'delivered': return <FiCheck />;
      default: return <FiClock />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const maxSales = Math.max(...stats.monthlySales.map(m => m.sales));

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-text">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your store overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                <stat.icon />
              </div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                {stat.change}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Sales Chart */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h2>Monthly Sales</h2>
            <button className="more-btn"><FiMoreVertical /></button>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {stats.monthlySales.map((item, index) => (
                <div key={item.month} className="bar-item">
                  <motion.div 
                    className="bar"
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.sales / maxSales) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    <span className="bar-value">${(item.sales / 1000).toFixed(1)}k</span>
                  </motion.div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div 
          className="orders-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn">
              <FiEye /> View All
            </button>
          </div>
          <div className="orders-list">
            {stats.recentOrders.map((order, index) => (
              <motion.div 
                key={order.id}
                className="order-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="order-info">
                  <span className="order-id">{order.id}</span>
                  <span className="order-customer">{order.customer}</span>
                </div>
                <div className="order-amount">${order.amount.toFixed(2)}</div>
                <div className={getStatusClass(order.status)}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div 
          className="users-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card-header">
            <h2>New Users</h2>
            <button className="view-all-btn">
              <FiEye /> View All
            </button>
          </div>
          <div className="users-list">
            {stats.recentUsers.map((user, index) => (
              <motion.div 
                key={user.id}
                className="user-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="user-avatar-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="user-details">
                  <span className="user-name-sm">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <div className="user-orders">
                  <span>{user.orders}</span>
                  <small>orders</small>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
