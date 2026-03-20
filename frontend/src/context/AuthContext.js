import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiBase';

const AuthContext = createContext();

const API_URL = API_BASE_URL;

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { message: text || `Request failed with status ${response.status}` };
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedToken = localStorage.getItem('electronicsShopToken');
    const savedUser = localStorage.getItem('electronicsShopUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await parseResponseBody(response);

      if (!response.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };

      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('electronicsShopToken', data.token);
      localStorage.setItem('electronicsShopUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await parseResponseBody(response);

      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };

      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('electronicsShopToken', data.token);
      localStorage.setItem('electronicsShopUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('electronicsShopToken');
    localStorage.removeItem('electronicsShopUser');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await parseResponseBody(response);

      if (!response.ok) {
        return { success: false, message: data.message || 'Update failed' };
      }

      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      localStorage.setItem('electronicsShopUser', JSON.stringify(newUserData));
      
      return { success: true };
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
