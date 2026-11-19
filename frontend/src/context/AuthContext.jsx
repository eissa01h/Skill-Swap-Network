import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured, isAdminEmail, determineUserRole } from '../config/supabaseClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.email) {
          const role = determineUserRole(parsed.email);
          return {
            ...parsed,
            role,
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }, [user]);

  // Real-time Supabase Auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check existing Supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email.toLowerCase();
        const role = determineUserRole(email);
        const metaName = session.user.user_metadata?.fullName || session.user.user_metadata?.full_name;
        const normalized = {
          id: session.user.id,
          userId: session.user.id,
          name: metaName || (isAdminEmail(email) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          fullName: metaName || (isAdminEmail(email) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          email: email,
          role: role,
          avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          title: isAdminEmail(email) ? 'Platform Administrator' : 'Skill Swap Member',
          location: session.user.user_metadata?.location || 'Remote',
          bio: session.user.user_metadata?.bio || 'Enthusiastic learner and teacher.',
          stats: { swapsCompleted: 0, hoursTaught: 0, rating: 5.0, reviewsCount: 0 },
        };
        setUser(normalized);
      }
    });

    // Listen for auth events (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const email = session.user.email.toLowerCase();
          const role = determineUserRole(email);
          const metaName = session.user.user_metadata?.fullName || session.user.user_metadata?.full_name;
          const normalized = {
            id: session.user.id,
            userId: session.user.id,
            name: metaName || (isAdminEmail(email) ? 'Eissa (Admin)' : 'Skill Swap Member'),
            fullName: metaName || (isAdminEmail(email) ? 'Eissa (Admin)' : 'Skill Swap Member'),
            email: email,
            role: role,
            avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
            title: isAdminEmail(email) ? 'Platform Administrator' : 'Skill Swap Member',
            location: session.user.user_metadata?.location || 'Remote',
            bio: session.user.user_metadata?.bio || 'Enthusiastic learner and teacher.',
            stats: { swapsCompleted: 0, hoursTaught: 0, rating: 5.0, reviewsCount: 0 },
          };
          setUser(normalized);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res) {
        const cleanEmail = (res.email || credentials.email).trim().toLowerCase();
        const role = determineUserRole(cleanEmail);
        const normalizedUser = {
          id: res.userId || res.id || `usr_${Date.now()}`,
          userId: res.userId || res.id,
          name: res.fullName || res.name || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          fullName: res.fullName || res.name || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          email: cleanEmail,
          role: role,
          avatar: res.avatarUrl || res.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          title: isAdminEmail(cleanEmail) ? 'Platform Administrator' : (res.headline || res.title || 'Skill Swap Member'),
          location: res.location || 'Remote',
          bio: res.bio || 'Enthusiastic learner and teacher.',
          stats: res.stats || { swapsCompleted: 0, hoursTaught: 0, rating: 5.0, reviewsCount: 0 },
        };
        setUser(normalizedUser);
        return { success: true, user: normalizedUser };
      }
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res) {
        const cleanEmail = (res.email || userData.email).trim().toLowerCase();
        const role = determineUserRole(cleanEmail);
        const normalizedUser = {
          id: res.userId || res.id || `usr_${Date.now()}`,
          userId: res.userId || res.id,
          name: res.fullName || res.name || userData.fullName,
          fullName: res.fullName || res.name || userData.fullName,
          email: cleanEmail,
          role: role,
          avatar: res.avatarUrl || res.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          title: isAdminEmail(cleanEmail) ? 'Platform Administrator' : 'Skill Swap Member',
          location: userData.location || 'Remote',
          bio: userData.bio || 'Enthusiastic learner and teacher.',
          stats: { swapsCompleted: 0, hoursTaught: 0, rating: 5.0, reviewsCount: 0 },
        };
        setUser(normalizedUser);
        return { success: true, user: normalizedUser };
      }
      return { success: false, error: 'Registration failed' };
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

  // Admin role is strictly granted ONLY to eissa.ej05@gmailcom / eissa.ej05@gmail.com
  const isAdmin = Boolean(
    user &&
    isAdminEmail(user.email) &&
    (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN')
  );

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
