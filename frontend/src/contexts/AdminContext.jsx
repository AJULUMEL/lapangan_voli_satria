import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if admin is logged in on mount
  useEffect(() => {
    if (token) {
      // Optionally verify token with backend
      try {
        const adminData = JSON.parse(localStorage.getItem('admin_data'));
        if (adminData) {
          setAdmin(adminData);
        }
      } catch (err) {
        console.error('Error loading admin data:', err);
        logout();
      }
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and admin data
      const token = data.data.token;
      setToken(token);
      setAdmin(data.data);
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_data', JSON.stringify(data.data));

      return { success: true, data: data.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
  };

  const isLoggedIn = () => !!token && !!admin;

  return (
    <AdminContext.Provider value={{ admin, token, loading, error, login, logout, isLoggedIn }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
