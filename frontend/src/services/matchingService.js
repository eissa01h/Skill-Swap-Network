import apiClient from './apiClient';
import { matchService as mockMatch } from './mockApi';

export const matchingService = {
  async getRecommendations() {
    try {
      return await apiClient.get('/matches/recommendations');
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockMatch.getRecommendedMatches();
      }
      throw err;
    }
  },
};

function isNetworkError(err) {
  return err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
}

export default matchingService;

