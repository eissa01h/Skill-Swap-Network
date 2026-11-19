import {
  MOCK_CURRENT_USER,
  MOCK_ADMIN_USER,
  MOCK_TEACHING_SKILLS,
  MOCK_LEARNING_INTERESTS,
  MOCK_MATCHES,
  MOCK_EXCHANGE_REQUESTS,
  MOCK_ACTIVE_EXCHANGES,
  MOCK_SCHEDULED_LESSONS,
  MOCK_MESSAGES,
  MOCK_REVIEWS,
  MOCK_NOTIFICATIONS,
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_REPORTS,
} from '../utils/mockData';

const STORAGE_KEYS = {
  USER: 'ssn_user',
  TEACHING_SKILLS: 'ssn_teaching_skills',
  LEARNING_INTERESTS: 'ssn_learning_interests',
  MATCHES: 'ssn_matches',
  EXCHANGES: 'ssn_exchanges',
  REQUESTS_INCOMING: 'ssn_requests_incoming',
  REQUESTS_OUTGOING: 'ssn_requests_outgoing',
  LESSONS: 'ssn_lessons',
  MESSAGES: 'ssn_messages',
  REVIEWS: 'ssn_reviews',
  NOTIFICATIONS: 'ssn_notifications',
  ADMIN_USERS: 'ssn_admin_users',
  ADMIN_REPORTS: 'ssn_admin_reports',
};

function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

// -------------------------------------------------------------
// 1. Auth Service
// -------------------------------------------------------------
export const authService = {
  async getCurrentUser() {
    return getStored(STORAGE_KEYS.USER, MOCK_CURRENT_USER);
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const isAdmin = email.toLowerCase().includes('admin');
    const user = isAdmin ? MOCK_ADMIN_USER : { ...MOCK_CURRENT_USER, email };
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  async register(formData) {
    if (!formData.email || !formData.fullName || !formData.password) {
      throw new Error('Please fill in all required registration fields.');
    }
    const newUser = {
      ...MOCK_CURRENT_USER,
      id: `usr_${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      location: formData.location || 'Remote',
      bio: formData.bio || 'New member on Skill Swap Network.',
      averageRating: 5.0,
      totalReviews: 0,
      completedSwaps: 0,
    };
    setStored(STORAGE_KEYS.USER, newUser);
    return newUser;
  },

  async updateProfile(updates) {
    const current = getStored(STORAGE_KEYS.USER, MOCK_CURRENT_USER);
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

// -------------------------------------------------------------
// 2. Skill Service (With Duplicate Prevention)
// -------------------------------------------------------------
export const skillService = {
  async getTeachingSkills() {
    return getStored(STORAGE_KEYS.TEACHING_SKILLS, MOCK_TEACHING_SKILLS);
  },

  async addTeachingSkill(skill) {
    const list = getStored(STORAGE_KEYS.TEACHING_SKILLS, MOCK_TEACHING_SKILLS);
    const normalizedName = skill.name.trim().toLowerCase();

    // Prevent duplicates
    const duplicate = list.some(s => s.name.trim().toLowerCase() === normalizedName);
    if (duplicate) {
      throw new Error(`You already have a teaching skill named "${skill.name.trim()}".`);
    }

    const created = {
      id: `ts_${Date.now()}`,
      name: skill.name.trim(),
      category: skill.category || 'Software Development',
      level: skill.level || 'INTERMEDIATE',
      experienceYears: skill.experienceYears || '1 year',
      description: skill.description || '',
      studentsHelped: 0,
    };
    const updated = [created, ...list];
    setStored(STORAGE_KEYS.TEACHING_SKILLS, updated);
    return created;
  },

  async updateTeachingSkill(id, updates) {
    const list = getStored(STORAGE_KEYS.TEACHING_SKILLS, MOCK_TEACHING_SKILLS);
    const updated = list.map(s => s.id === id ? { ...s, ...updates } : s);
    setStored(STORAGE_KEYS.TEACHING_SKILLS, updated);
    return updated.find(s => s.id === id);
  },

  async deleteTeachingSkill(id) {
    const list = getStored(STORAGE_KEYS.TEACHING_SKILLS, MOCK_TEACHING_SKILLS);
    const updated = list.filter(s => s.id !== id);
    setStored(STORAGE_KEYS.TEACHING_SKILLS, updated);
    return true;
  },

  async getLearningInterests() {
    return getStored(STORAGE_KEYS.LEARNING_INTERESTS, MOCK_LEARNING_INTERESTS);
  },

  async addLearningInterest(interest) {
    const list = getStored(STORAGE_KEYS.LEARNING_INTERESTS, MOCK_LEARNING_INTERESTS);
    const normalizedName = interest.name.trim().toLowerCase();

    // Prevent duplicates
    const duplicate = list.some(i => i.name.trim().toLowerCase() === normalizedName);
    if (duplicate) {
      throw new Error(`You already have a learning goal named "${interest.name.trim()}".`);
    }

    const created = {
      id: `li_${Date.now()}`,
      name: interest.name.trim(),
      category: interest.category || 'Languages',
      currentLevel: interest.currentLevel || 'BEGINNER',
      targetLevel: interest.targetLevel || 'INTERMEDIATE',
      goal: interest.goal || '',
    };
    const updated = [created, ...list];
    setStored(STORAGE_KEYS.LEARNING_INTERESTS, updated);
    return created;
  },

  async updateLearningInterest(id, updates) {
    const list = getStored(STORAGE_KEYS.LEARNING_INTERESTS, MOCK_LEARNING_INTERESTS);
    const updated = list.map(i => i.id === id ? { ...i, ...updates } : i);
    setStored(STORAGE_KEYS.LEARNING_INTERESTS, updated);
    return updated.find(i => i.id === id);
  },

  async deleteLearningInterest(id) {
    const list = getStored(STORAGE_KEYS.LEARNING_INTERESTS, MOCK_LEARNING_INTERESTS);
    const updated = list.filter(i => i.id !== id);
    setStored(STORAGE_KEYS.LEARNING_INTERESTS, updated);
    return true;
  },
};

// -------------------------------------------------------------
// 3. Match & Partner Search Service
// -------------------------------------------------------------
export const matchService = {
  async getRecommendedMatches() {
    return getStored(STORAGE_KEYS.MATCHES, MOCK_MATCHES);
  },

  async searchPartners({ query = '', category = 'All Categories', minRating = 0 }) {
    const allPartners = [
      {
        id: 'usr_002',
        name: 'Carlos Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        title: 'Bilingual Translator & Tech Enthusiast',
        location: 'Austin, TX',
        rating: 5.0,
        reviewsCount: 19,
        category: 'Languages',
        teaches: 'Conversational Spanish (Native)',
        wants: 'React Architecture',
        bio: 'Native Spanish speaker from Madrid now living in the US. Eager to switch careers into tech and need mentorship in React!',
        availability: 'Weekends, Evenings',
        mutualMatch: true,
      },
      {
        id: 'usr_003',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        title: 'Commercial Portrait Photographer',
        location: 'Seattle, WA',
        rating: 4.9,
        reviewsCount: 31,
        category: 'Design & Creative',
        teaches: 'Digital Photography & Lightroom',
        wants: 'Python & Data Structures',
        bio: 'Photographer with 8 years studio experience. Wanting to learn Python for automation and image sorting algorithms.',
        availability: 'Saturday mornings',
        mutualMatch: true,
      },
      {
        id: 'usr_004',
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        title: 'Acoustic Guitarist & Singer-Songwriter',
        location: 'Nashville, TN',
        rating: 4.85,
        reviewsCount: 15,
        category: 'Music & Audio',
        teaches: 'Acoustic Guitar Fingerpicking',
        wants: 'Classical Piano Basics',
        bio: 'Full-time musician teaching guitar chords and acoustic rhythm. Looking to improve keyboard accompaniment.',
        availability: 'Weekday nights',
        mutualMatch: true,
      },
      {
        id: 'usr_005',
        name: 'Liam Becker',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        title: 'Senior Product Designer',
        location: 'Berlin / Remote',
        rating: 4.9,
        reviewsCount: 22,
        category: 'Design & Creative',
        teaches: 'Figma UI/UX & Design Systems',
        wants: 'React Architecture',
        bio: 'Designer passionate about design tokens and component libraries. Looking to exchange for frontend coding.',
        availability: 'Flexible weekends',
        mutualMatch: false,
      },
      {
        id: 'usr_006',
        name: 'Amara Okafor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        title: 'SEO Specialist & Content Strategist',
        location: 'London, UK',
        rating: 5.0,
        reviewsCount: 14,
        category: 'Business & Marketing',
        teaches: 'Growth Marketing & Technical SEO',
        wants: 'Python Automation',
        bio: 'Helps startups scale search visibility. Looking for Python mentorship to write scraper tools.',
        availability: 'Evenings UTC',
        mutualMatch: false,
      },
    ];

    return allPartners.filter(p => {
      const q = query.trim().toLowerCase();
      const matchesText = !q ||
        p.name.toLowerCase().includes(q) ||
        p.teaches.toLowerCase().includes(q) ||
        p.wants.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q);

      const matchesCat = category === 'All Categories' || p.category === category;
      const matchesRating = Number(p.rating) >= Number(minRating);

      return matchesText && matchesCat && matchesRating;
    });
  },

  async getPublicProfile(userId) {
    const all = await this.searchPartners({});
    const found = all.find(p => p.id === userId);
    if (found) {
      return {
        ...found,
        teachingSkills: [
          { name: found.teaches, level: 'ADVANCED', description: 'Experienced practitioner.' }
        ],
        learningGoals: [
          { name: found.wants, targetLevel: 'INTERMEDIATE' }
        ],
      };
    }
    return {
      id: userId,
      name: 'Community Member',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      title: 'Active Skill Exchanger',
      location: 'Remote',
      rating: 5.0,
      reviewsCount: 12,
      bio: 'Lifelong learner actively participating in skill exchanges.',
      teachingSkills: [{ name: 'Web Development', level: 'ADVANCED' }],
      learningGoals: [{ name: 'Conversational French', targetLevel: 'BEGINNER' }],
    };
  },
};

// -------------------------------------------------------------
// 4. Swap Request & Exchange Lifecycle Service
// -------------------------------------------------------------
export const swapService = {
  async getIncomingRequests() {
    return getStored(STORAGE_KEYS.REQUESTS_INCOMING, MOCK_EXCHANGE_REQUESTS.incoming);
  },

  async getOutgoingRequests() {
    return getStored(STORAGE_KEYS.REQUESTS_OUTGOING, MOCK_EXCHANGE_REQUESTS.outgoing);
  },

  async createProposal({ partner, youOffer, youWant, message, proposedSchedule }) {
    if (!youOffer || !youWant) {
      throw new Error('Please select both offered and requested skills.');
    }
    const outgoing = getStored(STORAGE_KEYS.REQUESTS_OUTGOING, MOCK_EXCHANGE_REQUESTS.outgoing);
    const newProposal = {
      id: `req_out_${Date.now()}`,
      recipient: {
        id: partner.id,
        name: partner.name,
        avatar: partner.avatar,
        location: partner.location,
        rating: partner.rating,
      },
      youOffer,
      youWant,
      proposedSchedule: proposedSchedule || '1 hour weekly',
      message: message || 'Hi! Would love to trade skills with you.',
      date: 'Just now',
      status: 'PENDING',
    };
    const updated = [newProposal, ...outgoing];
    setStored(STORAGE_KEYS.REQUESTS_OUTGOING, updated);
    return newProposal;
  },

  async acceptRequest(requestId) {
    const incoming = getStored(STORAGE_KEYS.REQUESTS_INCOMING, MOCK_EXCHANGE_REQUESTS.incoming);
    const target = incoming.find(r => r.id === requestId);
    if (!target) throw new Error('Request not found');

    const updatedIncoming = incoming.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' } : r);
    setStored(STORAGE_KEYS.REQUESTS_INCOMING, updatedIncoming);

    // Also add to Active Exchanges
    const exchanges = getStored(STORAGE_KEYS.EXCHANGES, MOCK_ACTIVE_EXCHANGES);
    const newExchange = {
      id: `exc_${Date.now()}`,
      partner: {
        id: target.sender.id,
        name: target.sender.name,
        avatar: target.sender.avatar,
        email: 'partner@skillswap.network',
      },
      skillYouTeach: target.theyWant,
      skillYouLearn: target.theyOffer,
      sessionsCompleted: 0,
      totalSessionsPlanned: 6,
      nextSession: 'To be scheduled in Lesson Schedule',
      status: 'ACTIVE',
      notes: `Agreement initiated via swap request on ${new Date().toLocaleDateString()}`,
    };
    setStored(STORAGE_KEYS.EXCHANGES, [newExchange, ...exchanges]);
    return true;
  },

  async declineRequest(requestId) {
    const incoming = getStored(STORAGE_KEYS.REQUESTS_INCOMING, MOCK_EXCHANGE_REQUESTS.incoming);
    const updatedIncoming = incoming.map(r => r.id === requestId ? { ...r, status: 'DECLINED' } : r);
    setStored(STORAGE_KEYS.REQUESTS_INCOMING, updatedIncoming);
    return true;
  },

  async cancelRequest(requestId) {
    const outgoing = getStored(STORAGE_KEYS.REQUESTS_OUTGOING, MOCK_EXCHANGE_REQUESTS.outgoing);
    const updatedOutgoing = outgoing.map(r => r.id === requestId ? { ...r, status: 'CANCELLED' } : r);
    setStored(STORAGE_KEYS.REQUESTS_OUTGOING, updatedOutgoing);
    return true;
  },

  async getActiveExchanges() {
    return getStored(STORAGE_KEYS.EXCHANGES, MOCK_ACTIVE_EXCHANGES);
  },

  async completeExchange(exchangeId) {
    const exchanges = getStored(STORAGE_KEYS.EXCHANGES, MOCK_ACTIVE_EXCHANGES);
    const updated = exchanges.map(e => e.id === exchangeId ? { ...e, status: 'COMPLETED', sessionsCompleted: e.totalSessionsPlanned } : e);
    setStored(STORAGE_KEYS.EXCHANGES, updated);
    return true;
  },
};

// -------------------------------------------------------------
// 5. Messaging Service
// -------------------------------------------------------------
export const messageService = {
  async getConversations() {
    return getStored(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
  },

  async sendMessage(partnerId, text) {
    if (!text.trim()) return null;
    const conversations = getStored(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
    const newMsg = {
      id: `t_${Date.now()}`,
      sender: 'Sarah',
      text: text.trim(),
      time: 'Just now',
      isSelf: true,
    };

    const updated = conversations.map(c => {
      if (c.partner.id === partnerId) {
        return {
          ...c,
          thread: [...c.thread, newMsg],
        };
      }
      return c;
    });

    setStored(STORAGE_KEYS.MESSAGES, updated);
    return newMsg;
  },
};

// -------------------------------------------------------------
// 6. Scheduling Service
// -------------------------------------------------------------
export const scheduleService = {
  async getLessons() {
    return getStored(STORAGE_KEYS.LESSONS, MOCK_SCHEDULED_LESSONS);
  },

  async scheduleLesson(lessonData) {
    if (!lessonData.topic || !lessonData.dateTime) {
      throw new Error('Topic and Date/Time are required.');
    }
    const lessons = getStored(STORAGE_KEYS.LESSONS, MOCK_SCHEDULED_LESSONS);
    const created = {
      id: `les_${Date.now()}`,
      partnerName: lessonData.partnerName || 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      topic: lessonData.topic,
      type: lessonData.type || 'TEACHING',
      dateTime: lessonData.dateTime,
      status: 'UPCOMING',
      meetingLink: lessonData.meetingLink || 'https://meet.jit.si/skillswap-session',
    };
    const updated = [created, ...lessons];
    setStored(STORAGE_KEYS.LESSONS, updated);
    return created;
  },
};

// -------------------------------------------------------------
// 7. Review & Feedback Service
// -------------------------------------------------------------
export const reviewService = {
  async getReviews() {
    return getStored(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
  },

  async submitReview({ partner, skill, rating, comment }) {
    if (!comment.trim()) {
      throw new Error('Please write a feedback comment.');
    }
    const reviews = getStored(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
    const newReview = {
      id: `rev_${Date.now()}`,
      authorName: 'Sarah Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      skillTaught: skill || 'Conversational Spanish',
      rating: Number(rating) || 5,
      date: 'Today',
      comment: comment.trim(),
    };
    const updated = [newReview, ...reviews];
    setStored(STORAGE_KEYS.REVIEWS, updated);
    return newReview;
  },
};

// -------------------------------------------------------------
// 8. Admin Service
// -------------------------------------------------------------
export const adminService = {
  async getStats() {
    return MOCK_ADMIN_STATS;
  },

  async getUsers(search = '') {
    const list = getStored(STORAGE_KEYS.ADMIN_USERS, MOCK_ADMIN_USERS);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  },

  async toggleUserBlock(userId) {
    const list = getStored(STORAGE_KEYS.ADMIN_USERS, MOCK_ADMIN_USERS);
    const updated = list.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
        };
      }
      return u;
    });
    setStored(STORAGE_KEYS.ADMIN_USERS, updated);
    return updated.find(u => u.id === userId);
  },

  async getReports() {
    return getStored(STORAGE_KEYS.ADMIN_REPORTS, MOCK_ADMIN_REPORTS);
  },

  async resolveReport(reportId, action) {
    const list = getStored(STORAGE_KEYS.ADMIN_REPORTS, MOCK_ADMIN_REPORTS);
    const updated = list.map(r => r.id === reportId ? { ...r, status: 'RESOLVED', actionTaken: action } : r);
    setStored(STORAGE_KEYS.ADMIN_REPORTS, updated);
    return true;
  },
};

