import apiClient from './apiClient';
import { swapService as mockSwap } from './mockApi';

export const exchangeService = {
  async getUserExchanges() {
    try {
      return await apiClient.get('/exchanges');
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.getActiveExchanges();
      }
      throw err;
    }
  },

  async getExchangeById(exchangeId) {
    try {
      return await apiClient.get(`/exchanges/${exchangeId}`);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = await mockSwap.getActiveExchanges();
        return list.find(e => e.id === exchangeId);
      }
      throw err;
    }
  },

  async completeExchange(exchangeId) {
    try {
      return await apiClient.post(`/exchanges/${exchangeId}/complete`);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockSwap.completeExchange(exchangeId);
      }
      throw err;
    }
  },

  async cancelExchange(exchangeId, reason = 'Terminated by participant') {
    try {
      return await apiClient.post(`/exchanges/${exchangeId}/cancel`, { reason });
    } catch (err) {
      if (isNetworkError(err)) {
        return true;
      }
      throw err;
    }
  },
};

function isNetworkError(err) {
  return err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
}

export default exchangeService;

