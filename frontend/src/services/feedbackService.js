import apiClient, { isBackendUnavailable } from './apiClient';
import { reviewService as mockReviews } from './mockApi';

export const feedbackService = {
  async getReviews() {
    try {
      return await apiClient.get('/feedback/user/me');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockReviews.getReviews();
      }
      throw err;
    }
  },

  async getUserReviews(userId) {
    try {
      return await apiClient.get(`/feedback/user/${userId}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockReviews.getReviews();
      }
      throw err;
    }
  },

  async getExchangeReviews(exchangeId) {
    try {
      return await apiClient.get(`/feedback/exchange/${exchangeId}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return [];
      }
      throw err;
    }
  },

  async submitFeedback(feedbackData) {
    try {
      return await apiClient.post('/feedback', feedbackData);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockReviews.submitReview(feedbackData);
      }
      throw err;
    }
  },
};

export default feedbackService;

