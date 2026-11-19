import apiClient from './apiClient';

export const reportService = {
  async submitReport(reportData) {
    try {
      return await apiClient.post('/reports', reportData);
    } catch (err) {
      if (isNetworkError(err)) {
        return {
          id: `rep_${Date.now()}`,
          status: 'PENDING',
          ...reportData,
          createdAt: new Date().toISOString(),
        };
      }
      throw err;
    }
  },
};

function isNetworkError(err) {
  return err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
}

export default reportService;
