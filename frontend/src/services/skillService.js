import { apiRequest } from './api';

export const skillService = {
  async getAllMasterSkills() {
    return apiRequest('/skills');
  },

  async searchSkills(query, category) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    return apiRequest(`/skills/search?${params.toString()}`);
  },

  async getUserSkills() {
    return apiRequest('/user-skills/me');
  },

  async addUserSkill(skillData) {
    return apiRequest('/user-skills', { method: 'POST', data: skillData });
  },

  async removeUserSkill(id) {
    return apiRequest(`/user-skills/${id}`, { method: 'DELETE' });
  },
};

