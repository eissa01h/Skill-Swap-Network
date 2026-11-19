import { teachingSkillService } from './teachingSkillService';
import { learningInterestService } from './learningInterestService';

export const skillService = {
  getTeachingSkills: () => teachingSkillService.getTeachingSkills(),
  addTeachingSkill: (skill) => teachingSkillService.addTeachingSkill(skill),
  updateTeachingSkill: (id, updates) => teachingSkillService.updateTeachingSkill(id, updates),
  deleteTeachingSkill: (id) => teachingSkillService.deleteTeachingSkill(id),

  getLearningInterests: () => learningInterestService.getLearningInterests(),
  addLearningInterest: (interest) => learningInterestService.addLearningInterest(interest),
  updateLearningInterest: (id, updates) => learningInterestService.updateLearningInterest(id, updates),
  deleteLearningInterest: (id) => learningInterestService.deleteLearningInterest(id),
};

export default skillService;
