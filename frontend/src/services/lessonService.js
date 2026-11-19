import apiClient from './apiClient';
import { scheduleService as mockLessons } from './mockApi';

export const lessonService = {
  async getLessons() {
    try {
      return await apiClient.get('/lessons');
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockLessons.getLessons();
      }
      throw err;
    }
  },

  async scheduleLesson(lessonData) {
    try {
      return await apiClient.post('/lessons', lessonData);
    } catch (err) {
      if (isNetworkError(err)) {
        return await mockLessons.scheduleLesson(lessonData);
      }
      throw err;
    }
  },

  async getLessonById(lessonId) {
    try {
      return await apiClient.get(`/lessons/${lessonId}`);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = await mockLessons.getLessons();
        return list.find(l => l.id === lessonId);
      }
      throw err;
    }
  },

  async updateLesson(lessonId, lessonData) {
    try {
      return await apiClient.put(`/lessons/${lessonId}`, lessonData);
    } catch (err) {
      if (isNetworkError(err)) {
        return { id: lessonId, ...lessonData };
      }
      throw err;
    }
  },

  async cancelLesson(lessonId, reason = 'Cancelled by participant') {
    try {
      return await apiClient.post(`/lessons/${lessonId}/cancel`, { reason });
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

export default lessonService;

