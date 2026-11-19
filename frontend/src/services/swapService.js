import { apiRequest } from './api';

export const swapService = {
  async getSentRequests() {
    return apiRequest('/swaps/sent');
  },

  async getReceivedRequests() {
    return apiRequest('/swaps/received');
  },

  async createSwapRequest(swapData) {
    return apiRequest('/swaps', { method: 'POST', data: swapData });
  },

  async acceptSwapRequest(id) {
    return apiRequest(`/swaps/${id}/accept`, { method: 'PATCH' });
  },

  async declineSwapRequest(id) {
    return apiRequest(`/swaps/${id}/decline`, { method: 'PATCH' });
  },

  async completeSwapRequest(id) {
    return apiRequest(`/swaps/${id}/complete`, { method: 'PATCH' });
  },

  async cancelSwapRequest(id) {
    return apiRequest(`/swaps/${id}/cancel`, { method: 'PATCH' });
  },
};
