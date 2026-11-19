import apiClient from './apiClient';
import { authService as mockAuth, matchService as mockMatch } from './mockApi';

export const profileService = {
  async getOwnProfile() {
    try {
      return await apiClient.get('/profiles/me');
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.getCurrentUser();
      }
      throw err;
    }
  },

  async updateProfile(profileData) {
    try {
      return await apiClient.put('/profiles/me', profileData);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.updateProfile(profileData);
      }
      throw err;
    }
  },

  async getPublicProfile(userId) {
    try {
      return await apiClient.get(`/profiles/${userId}`);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockMatch.getPartnerPublicProfile(userId);
      }
      throw err;
    }
  },
};

function isNetworkError(err) {
  return err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
}

export default profileService;
