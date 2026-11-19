import { skillService as mockSkills } from './mockApi';

export const skillService = {
  getTeachingSkills: () => mockSkills.getTeachingSkills(),
  addTeachingSkill: (skill) => mockSkills.addTeachingSkill(skill),
  updateTeachingSkill: (id, updates) => mockSkills.updateTeachingSkill(id, updates),
  deleteTeachingSkill: (id) => mockSkills.deleteTeachingSkill(id),

  getLearningInterests: () => mockSkills.getLearningInterests(),
  addLearningInterest: (interest) => mockSkills.addLearningInterest(interest),
  updateLearningInterest: (id, updates) => mockSkills.updateLearningInterest(id, updates),
  deleteLearningInterest: (id) => mockSkills.deleteLearningInterest(id),
};
