import { apiRequest } from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async register(userData) {
    return apiRequest('/auth/register', { method: 'POST', data: userData });
  },

  async login(credentials) {
    const response = await apiRequest('/auth/login', { method: 'POST', data: credentials });
    if (response?.data?.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    return response;
  },

  async getCurrentUser() {
    return apiRequest('/auth/me');
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

