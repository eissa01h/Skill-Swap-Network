import { STORAGE_KEYS } from '../utils/constants';
import { authService as mockAuth } from './mockApi';
import { profileService } from './profileService';
import { supabase, isSupabaseConfigured, isAdminEmail, determineUserRole } from '../config/supabaseClient';

export const authService = {
  async register({ fullName, email, password, location = 'Remote', bio = '' }) {
    const cleanEmail = email.trim().toLowerCase();
    const role = determineUserRole(cleanEmail);

    // 1. Supabase Auth Direct
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            fullName: fullName.trim(),
            name: fullName.trim(),
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
      const token = data.session?.access_token || `sb_token_${sessionUser?.id || Date.now()}`;
      const res = {
        token,
        userId: sessionUser?.id || `usr_${Date.now()}`,
        id: sessionUser?.id || `usr_${Date.now()}`,
        email: cleanEmail,
        fullName: fullName.trim(),
        name: fullName.trim(),
        role,
        location,
        bio,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      };

      // Persist across both storage identifiers for reliable session recovery
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      localStorage.setItem('ssn_user', JSON.stringify(res));
      return res;
    }

    // 2. Standalone Client Persistence Fallback (zero backend dependency)
    const res = await mockAuth.register({ fullName, email: cleanEmail, password, location, bio });
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token || `token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
    localStorage.setItem('ssn_user', JSON.stringify(res));
    return res;
  },

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const role = determineUserRole(cleanEmail);

    // 1. Supabase Auth Direct
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const sessionUser = data.user;
      const metaName = sessionUser?.user_metadata?.fullName || sessionUser?.user_metadata?.name;
      const displayName = metaName || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member');

      const res = {
        token: data.session?.access_token || `sb_token_${sessionUser?.id || Date.now()}`,
        userId: sessionUser?.id,
        id: sessionUser?.id,
        email: cleanEmail,
        fullName: displayName,
        name: displayName,
        role,
        location: sessionUser?.user_metadata?.location || 'Remote',
        bio: sessionUser?.user_metadata?.bio || 'Enthusiastic learner and teacher.',
        avatarUrl: sessionUser?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      localStorage.setItem('ssn_user', JSON.stringify(res));
      return res;
    }

    // 2. Standalone Client Persistence Fallback (zero backend dependency)
    const res = await mockAuth.login({ email: cleanEmail, password });
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token || `token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
    localStorage.setItem('ssn_user', JSON.stringify(res));
    return res;
  },

  async logout() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // Ignore signout error
      }
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem('ssn_user');
  },

  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const cleanEmail = session.user.email.toLowerCase();
        const role = determineUserRole(cleanEmail);
        const metaName = session.user.user_metadata?.fullName || session.user.user_metadata?.name;
        return {
          id: session.user.id,
          userId: session.user.id,
          email: cleanEmail,
          fullName: metaName || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          role,
        };
      }
    }

    return await mockAuth.getCurrentUser();
  },

  async updateProfile(profileData) {
    return await profileService.updateProfile(profileData);
  },
};

export default authService;
