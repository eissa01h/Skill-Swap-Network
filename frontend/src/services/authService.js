import apiClient from './apiClient';
import { STORAGE_KEYS } from '../utils/constants';
import { authService as mockAuth } from './mockApi';
import { profileService } from './profileService';
import { supabase, isSupabaseConfigured, isAdminEmail, determineUserRole } from '../config/supabaseClient';

export const authService = {
  async register({ fullName, email, password, location = 'Remote', bio = '' }) {
    const cleanEmail = email.trim().toLowerCase();
    const role = determineUserRole(cleanEmail);

    // 1. Supabase Auth Integration
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            fullName: fullName.trim(),
            location,
            bio,
            role,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const sessionUser = data.user;
      const res = {
        token: data.session?.access_token || `sb_token_${Date.now()}`,
        userId: sessionUser?.id || `usr_${Date.now()}`,
        email: cleanEmail,
        fullName: fullName.trim(),
        role,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      return res;
    }

    // 2. Spring Boot REST API
    try {
      const res = await apiClient.post('/auth/register', {
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
      });
      if (res?.token) {
        // Enforce role consistency
        res.role = determineUserRole(cleanEmail);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      }
      return res;
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.register({ fullName, email: cleanEmail, password, location, bio });
      }
      throw err;
    }
  },

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const role = determineUserRole(cleanEmail);

    // 1. Supabase Auth Integration
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const sessionUser = data.user;
      const metaName = sessionUser?.user_metadata?.fullName || sessionUser?.user_metadata?.full_name;
      const displayName = metaName || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member');

      const res = {
        token: data.session?.access_token,
        userId: sessionUser?.id,
        email: cleanEmail,
        fullName: displayName,
        role,
        avatarUrl: sessionUser?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      return res;
    }

    // 2. Spring Boot REST API
    try {
      const res = await apiClient.post('/auth/login', { email: cleanEmail, password });
      if (res?.token) {
        // Enforce role consistency: only designated admin gets ROLE_ADMIN
        res.role = determineUserRole(cleanEmail);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      }
      return res;
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.login({ email: cleanEmail, password });
      }
      throw err;
    }
  },

  async logout() {
    // 1. Supabase sign out
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // Ignore network error on signout
      }
    }

    // 2. Backend sign out
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Ignored if network error on logout
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const cleanEmail = session.user.email.toLowerCase();
        const role = determineUserRole(cleanEmail);
        return {
          id: session.user.id,
          userId: session.user.id,
          email: cleanEmail,
          fullName: session.user.user_metadata?.fullName || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          role,
        };
      }
    }

    try {
      const res = await apiClient.get('/auth/me');
      if (res) {
        res.role = determineUserRole(res.email);
      }
      return res;
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.getCurrentUser();
      }
      throw err;
    }
  },

  async updateProfile(profileData) {
    return await profileService.updateProfile(profileData);
  },
};

function isNetworkError(err) {
  return err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
}

export default authService;
