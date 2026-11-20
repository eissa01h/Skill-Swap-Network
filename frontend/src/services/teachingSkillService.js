import apiClient, { isBackendUnavailable } from './apiClient';
import { skillService as mockSkills } from './mockApi';

export const teachingSkillService = {
  async getTeachingSkills() {
    try {
      return await apiClient.get('/skills/teaching');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.getTeachingSkills();
      }
      throw err;
    }
  },

  async addTeachingSkill(skillData) {
    try {
      return await apiClient.post('/skills/teaching', skillData);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.addTeachingSkill(skillData);
      }
      throw err;
    }
  },

  async updateTeachingSkill(id, skillData) {
    try {
      return await apiClient.put(`/skills/teaching/${id}`, skillData);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.updateTeachingSkill(id, skillData);
      }
      throw err;
    }
  },

  async deleteTeachingSkill(id) {
    try {
      return await apiClient.delete(`/skills/teaching/${id}`);
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return await mockSkills.deleteTeachingSkill(id);
      }
      throw err;
    }
  },

  async getCatalog() {
    try {
      return await apiClient.get('/skills');
    } catch (err) {
      if (isBackendUnavailable(err)) {
        return [
          { id: '1', name: 'React Architecture', category: 'Programming & Tech' },
          { id: '2', name: 'Python Programming', category: 'Programming & Tech' },
          { id: '3', name: 'Conversational Spanish', category: 'Languages' },
          { id: '4', name: 'Acoustic Guitar Fingerpicking', category: 'Music & Audio' },
          { id: '5', name: 'Digital Photography & Editing', category: 'Design & Creative' },
        ];
      }
      throw err;
    }
  },
};

export default teachingSkillService;

