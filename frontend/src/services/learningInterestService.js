import apiClient, { isBackendUnavailable } from './apiClient';
import { skillService as mockSkills } from './mockApi';

export const learningInterestService = {
  async getLearningInterests() {
    try {
      return await apiClient.get('/skills/learning');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.getLearningInterests();
      }
      throw err;
    }
  },

  async addLearningInterest(interestData) {
    try {
      return await apiClient.post('/skills/learning', interestData);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.addLearningInterest(interestData);
      }
      throw err;
    }
  },

  async updateLearningInterest(id, interestData) {
    try {
      return await apiClient.put(`/skills/learning/${id}`, interestData);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.updateLearningInterest(id, interestData);
      }
      throw err;
    }
  },

  async deleteLearningInterest(id) {
    try {
      return await apiClient.delete(`/skills/learning/${id}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.deleteLearningInterest(id);
      }
      throw err;
    }
  },
};

export default learningInterestService;

