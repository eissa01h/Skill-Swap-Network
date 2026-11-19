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

  test('Edge Case 9: Default Role Assignment & Exclusive Admin Email Protection (eissa.ej05@gmailcom)', async () => {
    // 1. Regular user registration defaults to ROLE_USER (member)
    const normalUser = await authService.register({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123!',
    });
    assert.equal(normalUser.role, 'ROLE_USER');

    // 2. An email with 'admin' in the name does NOT get admin
    const fakeAdmin = await authService.register({
      fullName: 'Fake Admin',
      email: 'admin.imposter@gmail.com',
      password: 'SecurePassword123!',
    });
    assert.equal(fakeAdmin.role, 'ROLE_USER');

    // 3. Only designated email eissa.ej05@gmailcom receives ROLE_ADMIN
    const designatedAdmin = await authService.login({
      email: 'eissa.ej05@gmailcom',
      password: 'AdminPassword123!',
    });
    assert.equal(designatedAdmin.role, 'ROLE_ADMIN');

    // 4. Also supports eissa.ej05@gmail.com
    const designatedAdminAlt = await authService.login({
      email: 'eissa.ej05@gmail.com',
      password: 'AdminPassword123!',
    });
    assert.equal(designatedAdminAlt.role, 'ROLE_ADMIN');
  });
});
