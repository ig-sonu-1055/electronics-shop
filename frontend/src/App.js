import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Admin imports
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import ProductManagement from './admin/pages/ProductManagement';
import UserManagement from './admin/pages/UserManagement';
import OrderManagement from './admin/pages/OrderManagement';
import Settings from './admin/pages/Settings';

import './App.css';

// Layout wrapper to conditionally show Navbar/Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <div className="app-ambient" aria-hidden="true">
        <span className="ambient-orb ambient-orb-1"></span>
        <span className="ambient-orb ambient-orb-2"></span>
        <span className="ambient-orb ambient-orb-3"></span>
      </div>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'main-content'}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
            <AppLayout>
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Profile />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </AppLayout>
          </Router>
          </CartProvider>
        </ProductProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
