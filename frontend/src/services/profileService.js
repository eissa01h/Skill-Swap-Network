import { STORAGE_KEYS } from '../utils/constants';
import { authService as mockAuth, matchService as mockMatch } from './mockApi';
import { supabase, isSupabaseConfigured, isAdminEmail, determineUserRole } from '../config/supabaseClient';

export const profileService = {
  async getOwnProfile() {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const cleanEmail = user.email.toLowerCase();
        const role = determineUserRole(cleanEmail);
        const metaName = user.user_metadata?.fullName || user.user_metadata?.name;
        return {
          id: user.id,
          userId: user.id,
          email: cleanEmail,
          fullName: metaName || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          name: metaName || (isAdminEmail(cleanEmail) ? 'Eissa (Admin)' : 'Skill Swap Member'),
          role,
          avatarUrl: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          title: user.user_metadata?.title || (isAdminEmail(cleanEmail) ? 'Platform Administrator' : 'Skill Swap Member'),
          location: user.user_metadata?.location || 'Remote',
          bio: user.user_metadata?.bio || 'Enthusiastic learner and teacher.',
        };
      }
    }
    return await mockAuth.getCurrentUser();
  },

  async updateProfile(profileData) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          fullName: profileData.fullName || profileData.name,
          name: profileData.fullName || profileData.name,
          title: profileData.title,
          location: profileData.location,
          bio: profileData.bio,
          avatar_url: profileData.avatarUrl,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
    }

    // Always keep client-side cache and storage in sync
    const updated = await mockAuth.updateProfile(profileData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
    localStorage.setItem('ssn_user', JSON.stringify(updated));
    return updated;
  },

  async getPublicProfile(userId) {
    if (mockMatch.getPublicProfile) {
      return await mockMatch.getPublicProfile(userId);
    }
    if (mockMatch.getPartnerPublicProfile) {
      return await mockMatch.getPartnerPublicProfile(userId);
    }
    return null;
  },
};

export default profileService;
