import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { MOCK_CURRENT_USER, MOCK_ADMIN_USER } from '../utils/mockData';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to MOCK_CURRENT_USER for immediate interactive exploration
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return stored ? JSON.parse(stored) : MOCK_CURRENT_USER;
    } catch {
      return MOCK_CURRENT_USER;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }, [user]);

  const loginAsMember = () => {
    setUser(MOCK_CURRENT_USER);
  };

  const loginAsAdmin = () => {
    setUser(MOCK_ADMIN_USER);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      // If admin credentials used, log in as admin
      if (credentials.email?.toLowerCase().includes('admin')) {
        setUser(MOCK_ADMIN_USER);
      } else {
        setUser({
          ...MOCK_CURRENT_USER,
          email: credentials.email,
        });
      }
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        login,
        logout,
        setUser,
        loginAsMember,
        loginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
