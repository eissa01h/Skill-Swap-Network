export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const SKILL_TYPES = {
  OFFERED: 'OFFERED',
  WANTED: 'WANTED',
};

export const PROFICIENCY_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
];

export const SWAP_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'skill_swap_auth_token',
  USER_DATA: 'skill_swap_user_data',
};
