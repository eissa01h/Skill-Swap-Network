import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import './setup.js';
import {
  authService,
  matchService,
  swapService,
  skillService,
} from '../frontend/src/services/mockApi.js';

describe('Non-Functional Requirements Testing (NFR-01 to NFR-07)', () => {

  test('NFR-01: Security and Privacy - Data Concealment & Role Protection', async () => {
    // 1. Public profile does not expose private email or password
    const publicProfile = await matchService.getPublicProfile('usr_001');
    assert.equal(publicProfile.email, undefined);
    assert.equal(publicProfile.password, undefined);
    assert.equal(publicProfile.passwordHash, undefined);

    // 2. Role is strictly assigned
    const member = await authService.register({
      fullName: 'Security Test User',
      email: 'sec_test@example.com',
      password: 'SafePassword123!',
    });
    assert.equal(member.role, 'ROLE_USER');
  });

  test('NFR-02: Usability - Error Envelopes & Actionable Messages', async () => {
    // Attempting invalid operations must return descriptive error messages
    try {
      await authService.login({ email: '', password: '' });
      assert.fail('Should throw error for empty credentials');
    } catch (err) {
      assert.ok(err.message.length > 5, 'Error message must be user-friendly and actionable');
    }

    try {
      await skillService.addTeachingSkill({ name: '' });
      assert.fail('Should throw error for empty skill name');
    } catch (err) {
      assert.ok(err.message.includes('Skill name is required'));
    }
  });

  test('NFR-03: Performance - Benchmark Response Latency (Target <= 3s for 95% of requests)', async () => {
    const latencies = [];
    const iterations = 50;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await matchService.getRecommendedMatches();
      await skillService.getTeachingSkills();
      await swapService.getActiveExchanges();
      const elapsed = performance.now() - start;
      latencies.push(elapsed);
    }

    latencies.sort((a, b) => a - b);
    const p95Index = Math.floor(iterations * 0.95);
    const p95Latency = latencies[p95Index];

    // Assert p95 is well below 3000ms (3 seconds)
    assert.ok(p95Latency < 3000, `P95 latency was ${p95Latency.toFixed(2)}ms, must be < 3000ms`);
  });

  test('NFR-04: Reliability and Data Integrity - State Transitions and Duplicate Prevention', async () => {
    // Ensure duplicate skill names in different cases are rejected
    await skillService.addTeachingSkill({ name: 'Reliability Skill', category: 'Software Development' });

    await assert.rejects(
      async () => {
        await skillService.addTeachingSkill({ name: 'RELIABILITY SKILL', category: 'Software Development' });
      },
      /already have a teaching skill named/
    );
  });

  test('NFR-05: Maintainability - Clean Layered Architecture & Separation of Concerns', () => {
    const servicesDir = path.resolve('frontend/src/services');
    assert.ok(fs.existsSync(servicesDir), 'Services directory must exist');

    const files = fs.readdirSync(servicesDir);
    // Modular services check
    assert.ok(files.includes('authService.js'));
    assert.ok(files.includes('profileService.js'));
    assert.ok(files.includes('teachingSkillService.js'));
    assert.ok(files.includes('learningInterestService.js'));
    assert.ok(files.includes('searchService.js'));
    assert.ok(files.includes('matchingService.js'));
    assert.ok(files.includes('exchangeRequestService.js'));
    assert.ok(files.includes('exchangeService.js'));
    assert.ok(files.includes('messageService.js'));
    assert.ok(files.includes('lessonService.js'));
    assert.ok(files.includes('feedbackService.js'));
    assert.ok(files.includes('reportService.js'));
    assert.ok(files.includes('adminService.js'));
  });

  test('NFR-06: Compatibility and Responsiveness - UI Tokens & Breakpoints', () => {
    const variablesCss = path.resolve('frontend/src/styles/variables.css');
    assert.ok(fs.existsSync(variablesCss));

    const content = fs.readFileSync(variablesCss, 'utf-8');
    assert.ok(content.includes('--color-primary-900'), 'Design tokens must specify primary color');
    assert.ok(content.includes('--color-accent-500'), 'Design tokens must specify accent color');
    assert.ok(content.includes('--radius-md'), 'Design tokens must specify border radius scale');
    assert.ok(content.includes('--shadow-md'), 'Design tokens must specify shadow elevation scale');
  });

  test('NFR-07: Fairness and Financial Constraints - Strict Non-Monetary Barter Model', () => {
    // Inspect database DDL migration to verify zero monetary concepts
    const schemaFile = path.resolve('backend/src/main/resources/db/migration/V1__initial_schema.sql');
    assert.ok(fs.existsSync(schemaFile));

    const schemaContent = fs.readFileSync(schemaFile, 'utf-8').toLowerCase();
    assert.ok(!schemaContent.includes('credit_card'), 'Must not contain credit_card');
    assert.ok(!schemaContent.includes('wallet_balance'), 'Must not contain wallet_balance');
    assert.ok(!schemaContent.includes('stripe_payment'), 'Must not contain stripe_payment');
    assert.ok(!schemaContent.includes('subscription_fee'), 'Must not contain subscription_fee');
    assert.ok(!schemaContent.includes('currency_code'), 'Must not contain currency_code');
  });
});
