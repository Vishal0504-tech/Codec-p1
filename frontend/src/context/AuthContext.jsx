import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api.js';

// Create the Context object which acts as the data container.
export const AuthContext = createContext();

// Create the Provider component which wraps our application and shares state.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app loads, check if the user is already logged in (by checking localStorage).
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler: Calls our backend server with credentials, sets user state, and caches details.
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler: Registers a new account, sets the active session, and logs in.
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try a different email.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler: Deletes local storage caches and resets user context state.
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // We return the context provider, passing our variables and functions down as value properties.
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
