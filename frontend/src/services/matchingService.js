import apiClient, { isBackendUnavailable } from './apiClient';
import { matchService as mockMatch } from './mockApi';

export const matchingService = {
  async getRecommendations() {
    try {
      return await apiClient.get('/matches/recommendations');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMatch.getRecommendedMatches();
      }
      throw err;
    }
  },
};

export default matchingService;

