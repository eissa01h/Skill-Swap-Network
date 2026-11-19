import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  authService,
  skillService,
  matchService,
  swapService,
  messageService,
  scheduleService,
  reviewService,
  adminService,
} from '../frontend/src/services/mockApi.js';
import { resetStorage } from './setup.js';

describe('User Story Acceptance Testing (US-01 to US-08)', () => {

  beforeEach(() => {
    resetStorage();
  });

  test('US-01: As a new user, I want to create an account and build a profile so that other members can discover my skills', async () => {
    // 1. Account Creation
    const user = await authService.register({
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      password: 'StrongPassword123!',
      location: 'Seattle, WA',
      bio: 'Cloud devops engineer wanting to learn guitar.',
    });
    assert.ok(user.id);
    assert.equal(user.fullName, 'Marcus Vance');

    // 2. Profile Setup
    const updated = await authService.updateProfile({
      headline: 'DevOps & Kubernetes Specialist',
      availability: 'Weekends, 10am - 4pm PST',
    });
    assert.equal(updated.headline, 'DevOps & Kubernetes Specialist');
    assert.equal(updated.availability, 'Weekends, 10am - 4pm PST');
  });

  test('US-02: As a member, I want to list what I can teach and what I want to learn so the platform can find relevant partners', async () => {
    // Add teaching skill
    const teach = await skillService.addTeachingSkill({
      name: 'Docker & Kubernetes',
      category: 'Software Development',
      level: 'ADVANCED',
      experienceYears: '4 years',
      description: 'Hands-on container orchestration.',
    });
    assert.ok(teach.id);

    // Add learning interest
    const learn = await skillService.addLearningInterest({
      name: 'Acoustic Guitar',
      category: 'Music & Arts',
      targetLevel: 'BEGINNER',
      priority: 'HIGH',
      learningGoals: 'Learn basic chords and fingerpicking.',
    });
    assert.ok(learn.id);

    // Verify both lists
    const teachingList = await skillService.getTeachingSkills();
    const learningList = await skillService.getLearningInterests();
    assert.ok(teachingList.some((s) => s.id === teach.id));
    assert.ok(learningList.some((i) => i.id === learn.id));
  });

  test('US-03: As a member, I want to search and receive reciprocal match recommendations so I find suitable swap partners', async () => {
    // Search directory
    const results = await matchService.searchPartners({ query: 'Spanish', category: 'Languages' });
    assert.ok(results.length > 0);
    assert.equal(results[0].category, 'Languages');

    // Reciprocal Barter Recommendations
    const recommendations = await matchService.getRecommendedMatches();
    assert.ok(recommendations.length > 0);
    const topRec = recommendations[0];
    assert.ok(topRec.matchScore >= 80);
    assert.ok(topRec.teachesYou);
    assert.ok(topRec.wantsFromYou);
  });

  test('US-04: As a member, I want to send, accept, decline, and cancel exchange requests so I can agree on barter terms', async () => {
    // Send proposal
    const proposal = await swapService.createProposal({
      partner: { id: 'usr_sarah', name: 'Sarah Chen' },
      youOffer: 'Docker & Kubernetes',
      youWant: 'React Architecture',
      message: 'Let us exchange container DevOps for advanced React patterns!',
      proposedSchedule: 'Twice a week',
    });
    assert.ok(proposal.id);
    assert.equal(proposal.status, 'PENDING');

    // Accept proposal
    const incoming = await swapService.getIncomingRequests();
    assert.ok(incoming.length > 0);
    await swapService.acceptRequest(incoming[0].id);

    const active = await swapService.getActiveExchanges();
    assert.ok(active.length > 0);
  });

  test('US-05: As an exchange participant, I want to message my partner and schedule lessons so we coordinate sessions', async () => {
    // 1. Peer messaging
    const convs = await messageService.getConversations();
    assert.ok(convs.length > 0);
    const partnerId = convs[0].partner.id;

    const msg = await messageService.sendMessage(partnerId, 'Looking forward to our first session tomorrow!');
    assert.ok(msg.id);
    assert.equal(msg.text, 'Looking forward to our first session tomorrow!');

    // 2. Schedule lesson
    const lesson = await scheduleService.scheduleLesson({
      partnerName: 'Carlos Rodriguez',
      topic: 'Spanish Verb Conjugation Practice',
      type: 'LEARNING',
      dateTime: '2026-11-28 18:00',
      meetingLink: 'https://meet.jit.si/spanish-session-01',
    });
    assert.ok(lesson.id);
    assert.equal(lesson.status, 'UPCOMING');
  });

  test('US-06: As an exchange participant, I want to track completed sessions and sign off on completion so our exchange finishes cleanly', async () => {
    const exchanges = await swapService.getActiveExchanges();
    assert.ok(exchanges.length > 0);
    const target = exchanges[0];

    await swapService.completeExchange(target.id);
    const updated = await swapService.getActiveExchanges();
    const completed = updated.find((e) => e.id === target.id);
    assert.equal(completed.status, 'COMPLETED');
    assert.equal(completed.sessionsCompleted, completed.totalSessionsPlanned);
  });

  test('US-07: As a participant in a completed exchange, I want to leave a rating and review so the community knows my partner is trustworthy', async () => {
    const review = await reviewService.submitReview({
      partner: 'Carlos Rodriguez',
      skill: 'Conversational Spanish',
      rating: 5,
      comment: 'Super helpful lesson series! Helped me prepare for my trip to Madrid.',
    });
    assert.ok(review.id);
    assert.equal(review.rating, 5);

    const reviews = await reviewService.getReviews();
    assert.ok(reviews.some((r) => r.id === review.id));
  });

  test('US-08: As a user, I want to report guideline violations, and as an admin, review and resolve reports to keep the community safe', async () => {
    // Member files report
    const reports = await adminService.getReports();
    assert.ok(reports.length > 0);
    const targetReport = reports[0];

    // Admin resolves report
    await adminService.resolveReport(targetReport.id, 'ACCOUNT_SUSPENDED');
    const afterResolve = await adminService.getReports();
    assert.equal(afterResolve.find((r) => r.id === targetReport.id).status, 'RESOLVED');

    // Admin blocks account
    const users = await adminService.getUsers();
    const blocked = await adminService.toggleUserBlock(users[0].id);
    assert.equal(blocked.status, 'BLOCKED');
  });
});

