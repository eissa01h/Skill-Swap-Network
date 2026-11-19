import { authService as mockAuth } from './mockApi';

export const authService = {
  getCurrentUser: () => mockAuth.getCurrentUser(),
  login: (credentials) => mockAuth.login(credentials),
  register: (data) => mockAuth.register(data),
  updateProfile: (updates) => mockAuth.updateProfile(updates),
  logout: () => mockAuth.logout(),
};
