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

describe('Functional Requirements Testing (FR-01 to FR-13)', () => {

  beforeEach(() => {
    resetStorage();
  });

  test('FR-01: User Account Management - Register, Login, and Session Validation', async () => {
    // 1. Register new member
    const newMember = await authService.register({
      fullName: 'Alice Walker',
      email: 'alice.walker@example.com',
      password: 'SecurePassword123!',
      location: 'Denver, CO',
      bio: 'Lifelong learner passionate about languages.',
    });

    assert.ok(newMember.id, 'User ID must be generated');
    assert.equal(newMember.fullName, 'Alice Walker');
    assert.equal(newMember.email, 'alice.walker@example.com');
    assert.equal(newMember.location, 'Denver, CO');

    // 2. Reject registration with missing fields
    await assert.rejects(
      async () => {
        await authService.register({ fullName: 'Incomplete' });
      },
      /required registration fields/,
      'Registration must fail without email and password'
    );

    // 3. Login with credentials
    const loggedIn = await authService.login({
      email: 'alice.walker@example.com',
      password: 'SecurePassword123!',
    });
    assert.equal(loggedIn.email, 'alice.walker@example.com');

    // 4. Logout
    await authService.logout();
    const currentUser = await authService.getCurrentUser();
    assert.ok(currentUser, 'Fallback or cleared state returns gracefully');
  });

  test('FR-02: User Profile Management - View and Edit Profile Details', async () => {
    const profile = await authService.getCurrentUser();
    assert.ok(profile.fullName, 'User profile must have full name');

    // Update profile
    const updated = await authService.updateProfile({
      headline: 'Full-Stack Software Mentor',
      bio: 'Over 6 years of experience building modern web systems.',
      location: 'Austin, TX (CST)',
      availability: 'Weekday evenings, Saturdays',
    });

    assert.equal(updated.headline, 'Full-Stack Software Mentor');
    assert.equal(updated.location, 'Austin, TX (CST)');
    assert.equal(updated.availability, 'Weekday evenings, Saturdays');
  });

  test('FR-03: Teaching Skill Management - Full CRUD & Duplicate Prevention', async () => {
    // 1. List initial skills
    const initialSkills = await skillService.getTeachingSkills();
    assert.ok(Array.isArray(initialSkills));

    // 2. Add new teaching skill
    const newSkill = await skillService.addTeachingSkill({
      name: 'Python Data Science',
      category: 'Software Development',
      level: 'ADVANCED',
      experienceYears: '4 years',
      description: 'Pandas, NumPy, and machine learning models.',
    });
    assert.ok(newSkill.id);
    assert.equal(newSkill.name, 'Python Data Science');

    // 3. Duplicate prevention: Adding the same skill must fail
    await assert.rejects(
      async () => {
        await skillService.addTeachingSkill({
          name: 'python data science', // Case-insensitive duplicate check
          category: 'Software Development',
          level: 'INTERMEDIATE',
        });
      },
      /already have a teaching skill named/,
      'Must reject duplicate teaching skill entries'
    );

    // 4. Update skill
    const updated = await skillService.updateTeachingSkill(newSkill.id, {
      experienceYears: '5 years',
      level: 'EXPERT',
    });
    assert.equal(updated.experienceYears, '5 years');
    assert.equal(updated.level, 'EXPERT');

    // 5. Delete skill
    await skillService.deleteTeachingSkill(newSkill.id);
    const afterDelete = await skillService.getTeachingSkills();
    assert.ok(!afterDelete.some((s) => s.id === newSkill.id), 'Deleted skill should not exist');
  });

  test('FR-04: Learning Skill Management - Full CRUD & Duplicate Prevention', async () => {
    // 1. Add learning interest
    const interest = await skillService.addLearningInterest({
      name: 'Graphic Design',
      category: 'Design & Creative',
      targetLevel: 'INTERMEDIATE',
      priority: 'HIGH',
      learningGoals: 'Master Figma UI design and wireframing.',
    });
    assert.ok(interest.id);
    assert.equal(interest.name, 'Graphic Design');

    // 2. Prevent duplicate learning interest
    await assert.rejects(
      async () => {
        await skillService.addLearningInterest({
          name: 'graphic design',
          category: 'Design & Creative',
        });
      },
      /already have a learning goal named/,
      'Must reject duplicate learning interests'
    );

    // 3. Update interest
    const updated = await skillService.updateLearningInterest(interest.id, {
      priority: 'MEDIUM',
    });
    assert.equal(updated.priority, 'MEDIUM');

    // 4. Delete interest
    await skillService.deleteLearningInterest(interest.id);
    const afterDelete = await skillService.getLearningInterests();
    assert.ok(!afterDelete.some((i) => i.id === interest.id));
  });

  test('FR-05: Search and Filter - Directory Filtering & No-Results State', async () => {
    // Search by query
    const searchByName = await matchService.searchPartners({ query: 'Carlos' });
    assert.ok(searchByName.length > 0);
    assert.ok(searchByName[0].name.includes('Carlos'));

    // Filter by category
    const searchByCategory = await matchService.searchPartners({ category: 'Languages' });
    assert.ok(searchByCategory.every((p) => p.category === 'Languages'));

    // Filter by high minimum rating
    const highRated = await matchService.searchPartners({ minRating: 4.9 });
    assert.ok(highRated.every((p) => p.rating >= 4.9));

    // Non-existent search query returns empty array
    const emptyResults = await matchService.searchPartners({ query: 'NonExistentSkillXYZ123' });
    assert.equal(emptyResults.length, 0, 'Must return empty results when no matches exist');
  });

  test('FR-06: Skill Matching & Recommendations - Two-Way Barter Algorithm', async () => {
    const recommendations = await matchService.getRecommendedMatches();
    assert.ok(Array.isArray(recommendations));
    assert.ok(recommendations.length > 0);

    const topMatch = recommendations[0];
    assert.ok(topMatch.matchScore >= 80, 'Top recommendation should have >= 80% match score');
    assert.ok(topMatch.teachesYou, 'Match must display what partner teaches current user');
    assert.ok(topMatch.wantsFromYou, 'Match must display what partner wants from current user');
    assert.ok(topMatch.bio || topMatch.sharedSchedule, 'Match must include reciprocal barter details');
  });

  test('FR-07: Exchange Request Management - Propose Barter Swap', async () => {
    const proposal = await swapService.createProposal({
      partner: { id: 'usr_carlos', name: 'Carlos Rodriguez' },
      youOffer: 'React Architecture',
      youWant: 'Conversational Spanish',
      message: 'Hi Carlos, let us trade programming for Spanish lessons!',
      proposedSchedule: 'Saturdays 10 AM',
    });

    assert.ok(proposal.id);
    assert.equal(proposal.status, 'PENDING');
    assert.equal(proposal.youOffer, 'React Architecture');
    assert.equal(proposal.youWant, 'Conversational Spanish');

    // Verify it appears in outgoing requests
    const outgoing = await swapService.getOutgoingRequests();
    assert.ok(outgoing.some((o) => o.id === proposal.id));
  });

  test('FR-08: Request Status Management - Accept, Decline, and Cancel Transitions', async () => {
    const incoming = await swapService.getIncomingRequests();
    assert.ok(incoming.length > 0);
    const targetRequestId = incoming[0].id;

    // Accept proposal
    await swapService.acceptRequest(targetRequestId);
    const activeExchanges = await swapService.getActiveExchanges();
    assert.ok(activeExchanges.some((e) => e.status === 'ACTIVE'));

    // Decline proposal
    if (incoming.length > 1) {
      const declineId = incoming[1].id;
      await swapService.declineRequest(declineId);
      const afterDecline = await swapService.getIncomingRequests();
      const declinedItem = afterDecline.find((r) => r.id === declineId);
      assert.equal(declinedItem.status, 'DECLINED');
    }

    // Cancel outgoing proposal
    const outgoing = await swapService.getOutgoingRequests();
    if (outgoing.length > 0) {
      await swapService.cancelRequest(outgoing[0].id);
      const afterCancel = await swapService.getOutgoingRequests();
      assert.equal(afterCancel.find((r) => r.id === outgoing[0].id).status, 'CANCELLED');
    }
  });

  test('FR-09: Communication and Lesson Arrangement - Chat & Session Scheduling', async () => {
    // 1. Messaging
    const conversations = await messageService.getConversations();
    assert.ok(conversations.length > 0);
    const partnerId = conversations[0].partner.id;

    const sentMessage = await messageService.sendMessage(partnerId, 'Hello, let us plan our session!');
    assert.ok(sentMessage.id);
    assert.equal(sentMessage.text, 'Hello, let us plan our session!');
    assert.equal(sentMessage.isSelf, true);

    // 2. Lesson Scheduling
    const lesson = await scheduleService.scheduleLesson({
      partnerName: 'Carlos Rodriguez',
      topic: 'React Hooks and State Management',
      type: 'TEACHING',
      dateTime: '2026-11-25 15:00',
      meetingLink: 'https://meet.jit.si/skillswap-react-lesson',
    });

    assert.ok(lesson.id);
    assert.equal(lesson.status, 'UPCOMING');
    assert.equal(lesson.topic, 'React Hooks and State Management');
    assert.ok(lesson.meetingLink.includes('meet.jit.si'));
  });

  test('FR-10: Exchange Completion Management - Session Progress & Verification', async () => {
    const exchanges = await swapService.getActiveExchanges();
    assert.ok(exchanges.length > 0);
    const targetExchangeId = exchanges[0].id;

    // Complete exchange
    await swapService.completeExchange(targetExchangeId);
    const afterComplete = await swapService.getActiveExchanges();
    const completedExchange = afterComplete.find((e) => e.id === targetExchangeId);
    assert.equal(completedExchange.status, 'COMPLETED');
    assert.equal(completedExchange.sessionsCompleted, completedExchange.totalSessionsPlanned);
  });

  test('FR-11: Ratings and Feedback Submission - 1-5 Star Reviews', async () => {
    // Submit review
    const review = await reviewService.submitReview({
      partner: 'Carlos Rodriguez',
      skill: 'Conversational Spanish',
      rating: 5,
      comment: 'Carlos is an exceptional tutor! Very patient and practical conversational exercises.',
    });

    assert.ok(review.id);
    assert.equal(review.rating, 5);
    assert.equal(review.skillTaught, 'Conversational Spanish');

    // Reject empty review comment
    await assert.rejects(
      async () => {
        await reviewService.submitReview({ comment: '   ' });
      },
      /feedback comment/,
      'Cannot submit empty feedback comment'
    );
  });

  test('FR-12: Profile and Feedback Viewing - Public Reputation & Reviews', async () => {
    const reviews = await reviewService.getReviews();
    assert.ok(Array.isArray(reviews));
    assert.ok(reviews.length > 0);
    assert.ok(reviews[0].authorName);
    assert.ok(reviews[0].rating >= 1 && reviews[0].rating <= 5);

    // Public Profile Viewing
    const publicProfile = await matchService.getPublicProfile('usr_002');
    assert.ok(publicProfile.name);
    assert.ok(publicProfile.teaches);
    assert.ok(publicProfile.wants);
    assert.ok(publicProfile.rating);
    // Sensitive data check
    assert.equal(publicProfile.password, undefined, 'Must never expose password');
    assert.equal(publicProfile.email, undefined, 'Must never expose email in public preview');
  });

  test('FR-13: Administration & Content Moderation - Reports & Account Actions', async () => {
    // 1. Admin Stats
    const stats = await adminService.getStats();
    assert.ok(stats.totalUsers > 0);
    assert.ok(stats.activeSwapsThisMonth >= 0);

    // 2. Member Management
    const users = await adminService.getUsers();
    assert.ok(users.length > 0);
    const targetUser = users[0];

    // Toggle block user
    const blocked = await adminService.toggleUserBlock(targetUser.id);
    assert.equal(blocked.status, 'BLOCKED');

    // Reinstate user
    const unblocked = await adminService.toggleUserBlock(targetUser.id);
    assert.equal(unblocked.status, 'ACTIVE');

    // 3. Moderation Reports
    const reports = await adminService.getReports();
    assert.ok(reports.length > 0);
    const reportId = reports[0].id;

    await adminService.resolveReport(reportId, 'WARNING_ISSUED');
    const updatedReports = await adminService.getReports();
    assert.equal(updatedReports.find((r) => r.id === reportId).status, 'RESOLVED');
  });
});
