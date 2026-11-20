import apiClient, { isBackendUnavailable } from './apiClient';
import { matchService as mockMatch } from './mockApi';

export const searchService = {
  async searchPartners({ query = '', category = 'All Categories', minRating = 0, location = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category && category !== 'All Categories') params.append('category', category);
      if (minRating) params.append('minRating', minRating);
      if (location) params.append('location', location);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      return await apiClient.get(`/matches/partners${queryString}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockMatch.searchPartners({ query, category, minRating });
      }
      throw err;
    }
  },
};

export default searchService;

