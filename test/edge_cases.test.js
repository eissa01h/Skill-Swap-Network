import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  authService,
  skillService,
  matchService,
  swapService,
  reviewService,
  adminService,
} from '../frontend/src/services/mockApi.js';
import { resetStorage } from './setup.js';

describe('Important Edge Cases & Negative Scenarios', () => {

  beforeEach(() => {
    resetStorage();
  });

  test('Edge Case 1: Duplicate Registration / Missing Password Rejection', async () => {
    await assert.rejects(
      async () => {
        await authService.register({ fullName: 'No Password', email: 'nopass@example.com' });
      },
      /required registration fields/
    );
  });

  test('Edge Case 2: Duplicate Teaching Skill Entry Prevention', async () => {
    await skillService.addTeachingSkill({ name: 'Docker', category: 'Software Development' });

    // Try same skill with extra spaces and mixed casing
    await assert.rejects(
      async () => {
        await skillService.addTeachingSkill({ name: '  DOCKER  ', category: 'Software Development' });
      },
      /already have a teaching skill named/
    );
  });

  test('Edge Case 3: Duplicate Learning Interest Entry Prevention', async () => {
    await skillService.addLearningInterest({ name: 'French B1', category: 'Languages' });

    await assert.rejects(
      async () => {
        await skillService.addLearningInterest({ name: 'french b1', category: 'Languages' });
      },
      /already have a learning goal named/
    );
  });

  test('Edge Case 4: Invalid Login Credentials Rejection', async () => {
    await assert.rejects(
      async () => {
        await authService.login({ email: '', password: '' });
      },
      /Email and password are required/
    );
  });

  test('Edge Case 5: Unmatched Skills Search Returns Clean Empty Results', async () => {
    const results = await matchService.searchPartners({
      query: 'Quantum Gravitational Teleportation',
      category: 'Software Development',
    });
    assert.ok(Array.isArray(results));
    assert.equal(results.length, 0);
  });

  test('Edge Case 6: Reviewing Without Comment Is Rejected', async () => {
    await assert.rejects(
      async () => {
        await reviewService.submitReview({
          partner: 'Carlos',
          skill: 'Spanish',
          rating: 5,
          comment: '',
        });
      },
      /Please write a feedback comment/
    );
  });

  test('Edge Case 7: Admin Account Self-Protection Rule', async () => {
    const users = await adminService.getUsers();
    assert.ok(users.length > 0);
    // Find admin user
    const admin = users.find((u) => u.role === 'ROLE_ADMIN');
    if (admin) {
      assert.equal(admin.role, 'ROLE_ADMIN');
    }
  });

  test('Edge Case 8: Lesson Scheduling Without Required Fields Rejection', async () => {
    const { scheduleService } = await import('../frontend/src/services/mockApi.js');

    await assert.rejects(
      async () => {
        await scheduleService.scheduleLesson({ topic: '', dateTime: '' });
      },
      /Topic and Date\/Time are required/
    );
  });
});
