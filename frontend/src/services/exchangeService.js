import apiClient, { isBackendUnavailable } from './apiClient';
import { swapService as mockSwap } from './mockApi';

export const exchangeService = {
  async getUserExchanges() {
    try {
      return await apiClient.get('/exchanges');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSwap.getActiveExchanges();
      }
      throw err;
    }
  },

  async getExchangeById(exchangeId) {
    try {
      return await apiClient.get(`/exchanges/${exchangeId}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
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
      if (isBackendUnavailable(err)) {
        return await mockSwap.completeExchange(exchangeId);
      }
      throw err;
    }
  },

  async cancelExchange(exchangeId, reason = 'Terminated by participant') {
    try {
      return await apiClient.post(`/exchanges/${exchangeId}/cancel`, { reason });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return true;
      }
      throw err;
    }
  },
};

export default exchangeService;

