import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { MOCK_CURRENT_USER, MOCK_ADMIN_USER } from '../utils/mockData';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...MOCK_CURRENT_USER, ...parsed };
        }
      }
      return MOCK_CURRENT_USER;
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
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
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
      const res = await authService.login(credentials);
      if (res) {
        const normalizedUser = {
          id: res.userId || res.id || 'u_1',
          name: res.fullName || res.name || 'Sarah Chen',
          email: res.email || credentials.email,
          role: res.role || (credentials.email?.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER'),
          avatar: res.avatarUrl || res.avatar || MOCK_CURRENT_USER.avatar,
          title: res.headline || res.title || MOCK_CURRENT_USER.title,
          location: res.location || MOCK_CURRENT_USER.location,
          bio: res.bio || MOCK_CURRENT_USER.bio,
          stats: res.stats || MOCK_CURRENT_USER.stats,
        };
        setUser(normalizedUser);
        return { success: true, user: normalizedUser };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res) {
        const normalizedUser = {
          id: res.userId || res.id || `u_${Date.now()}`,
          name: res.fullName || res.name || userData.fullName,
          email: res.email || userData.email,
          role: res.role || 'ROLE_USER',
          avatar: res.avatarUrl || res.avatar || MOCK_CURRENT_USER.avatar,
          title: 'Skill Swap Member',
          location: 'Remote',
          bio: 'Enthusiastic learner and teacher.',
          stats: { swapsCompleted: 0, hoursTaught: 0, rating: 5.0, reviewsCount: 0 },
        };
        setUser(normalizedUser);
        return { success: true, user: normalizedUser };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        login,
        register,
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
