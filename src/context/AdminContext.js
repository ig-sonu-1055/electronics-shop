import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminContext = createContext();

export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const savedAdmin = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    
    if (savedAdmin && token) {
      setAdmin(JSON.parse(savedAdmin));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminAPI.login({ email, password });
      
      setAdmin(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      localStorage.setItem('adminToken', response.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
