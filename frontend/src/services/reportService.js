import apiClient, { isBackendUnavailable } from './apiClient';

export const reportService = {
  async submitReport(reportData) {
    try {
      return await apiClient.post('/reports', reportData);
    } catch (err) {
      if (isBackendUnavailable(err)) {
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

export default reportService;

