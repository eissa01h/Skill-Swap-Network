import apiClient, { isBackendUnavailable } from './apiClient';
import { adminService as mockAdmin } from './mockApi';

export const adminService = {
  async getStats() {
    try {
      return await apiClient.get('/admin/stats');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockAdmin.getStats();
      }
      throw err;
    }
  },

  async getUsers(search = '') {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      return await apiClient.get(`/admin/users${query}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockAdmin.getUsers(search);
      }
      throw err;
    }
  },

  async blockUser(userId, reason = 'Administrative suspension') {
    try {
      return await apiClient.post(`/admin/users/${userId}/block`, { reason });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockAdmin.toggleUserBlock(userId);
      }
      throw err;
    }
  },

  async unblockUser(userId, reason = 'Administrative reinstatement') {
    try {
      return await apiClient.post(`/admin/users/${userId}/unblock`, { reason });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockAdmin.toggleUserBlock(userId);
      }
      throw err;
    }
  },

  async toggleUserBlock(userId) {
    try {
      return await apiClient.post(`/admin/users/${userId}/block`, { reason: 'Status toggled by administrator' });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockAdmin.toggleUserBlock(userId);
      }
      throw err;
    }
  },

  async getReports(status = '') {
    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : '';
      return await apiClient.get(`/admin/reports${query}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        const list = await mockAdmin.getReports();
        return status ? list.filter(r => r.status === status) : list;
      }
      throw err;
    }
  },

  async getReportById(reportId) {
    try {
      return await apiClient.get(`/admin/reports/${reportId}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        const list = await mockAdmin.getReports();
        return list.find(r => r.id === reportId);
      }
      throw err;
    }
  },

  async resolveReport(reportId, action, notes = '') {
    try {
      return await apiClient.post(`/admin/reports/${reportId}/resolve`, { action, notes });
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockAdmin.resolveReport(reportId, action);
      }
      throw err;
    }
  },

  async getAuditLogs() {
    try {
      return await apiClient.get('/admin/audit-logs');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return [];
      }
      throw err;
    }
  },
};

export default adminService;
