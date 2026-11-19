import apiClient from './apiClient';
import { swapService as mockSwap } from './mockApi';

export const exchangeRequestService = {
  async createRequest(proposalData) {
    try {
      return await apiClient.post('/requests', proposalData);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.createProposal(proposalData);
      }
      throw err;
    }
  },

  async getSentRequests() {
    try {
      return await apiClient.get('/requests/sent');
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.getOutgoingRequests();
      }
      throw err;
    }
  },

  async getReceivedRequests() {
    try {
      return await apiClient.get('/requests/received');
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.getIncomingRequests();
      }
      throw err;
    }
  },

  async acceptRequest(requestId) {
    try {
      return await apiClient.post(`/requests/${requestId}/accept`);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.acceptRequest(requestId);
      }
      throw err;
    }
  },

  async declineRequest(requestId) {
    try {
      return await apiClient.post(`/requests/${requestId}/decline`);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.declineRequest(requestId);
      }
      throw err;
    }
  },

  async cancelRequest(requestId, reason = 'Withdrawn by sender') {
    try {
      return await apiClient.post(`/requests/${requestId}/cancel`, { reason });
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.cancelRequest(requestId);
      }
      throw err;
    }
  },
};

function isNetworkError(err) {
  return err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
}

export default exchangeRequestService;

