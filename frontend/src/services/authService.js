import apiClient from './apiClient';
import { STORAGE_KEYS } from '../utils/constants';
import { authService as mockAuth } from './mockApi';
import { profileService } from './profileService';

export const authService = {
  async register({ fullName, email, password }) {
    try {
      const res = await apiClient.post('/auth/register', { fullName, email, password });
      if (res?.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      }
      return res;
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.register({ fullName, email, password });
      }
      throw err;
    }
  },

  async login({ email, password }) {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res?.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res));
      }
      return res;
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockAuth.login({ email, password });
      }
      throw err;
    }
  },

  async logout() {
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
    try {
      return await apiClient.get('/auth/me');
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
