/**
 * Mock Data Store for Skill Swap Network
 * Provides rich, realistic data for public, authenticated app, and admin experiences.
 */

export const MOCK_CURRENT_USER = {
  id: 'usr_001',
  fullName: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  role: 'ROLE_USER',
  title: 'Full-Stack Software Engineer & Amateur Pianist',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  location: 'San Francisco, CA (PST)',
  bio: 'Building modern web applications by day, practicing classical piano and jazz chords by night. Looking to trade Python, React, and system design expertise for Spanish fluency or digital photography techniques.',
  availability: 'Weekday evenings (after 6 PM) and Saturday mornings',
  averageRating: 4.95,
  totalReviews: 24,
  completedSwaps: 18,
  joinedDate: 'March 2025',
};

export const MOCK_ADMIN_USER = {
  id: 'usr_admin',
  fullName: 'David Sterling',
  email: 'admin@skillswap.network',
  role: 'ROLE_ADMIN',
  title: 'Platform Safety & Community Moderator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  location: 'Remote (UTC)',
};

export const MOCK_SKILL_CATEGORIES = [
  'All Categories',
  'Software Development',
  'Music & Audio',
  'Languages',
  'Design & Creative',
  'Business & Marketing',
  'Cooking & Culinary',
  'Academics & Science',
];

export const MOCK_TEACHING_SKILLS = [
  {
    id: 'ts_01',
    name: 'React & Modern Frontend Architecture',
    category: 'Software Development',
    level: 'EXPERT',
    experienceYears: '6 years',
    description: 'Component architecture, state management with Context/Zustand, performance optimization, and custom hook development.',
    studentsHelped: 12,
  },
  {
    id: 'ts_02',
    name: 'Python & Data Structures',
    category: 'Software Development',
    level: 'ADVANCED',
    experienceYears: '5 years',
    description: 'Clean Pythonic coding, object-oriented concepts, algorithms, and practical automation scripts.',
    studentsHelped: 8,
  },
  {
    id: 'ts_03',
    name: 'Classical Piano (Intermediate)',
    category: 'Music & Audio',
    level: 'INTERMEDIATE',
    experienceYears: '4 years',
    description: 'Sheet music reading, scales, finger dexterity, and basic music theory for adult beginners.',
    studentsHelped: 4,
  },
];

export const MOCK_LEARNING_INTERESTS = [
  {
    id: 'li_01',
    name: 'Conversational Spanish',
    category: 'Languages',
    targetLevel: 'INTERMEDIATE',
    currentLevel: 'BEGINNER',
    goal: 'Be able to hold fluid conversations with native speakers while traveling in South America.',
  },
  {
    id: 'li_02',
    name: 'Digital Photography & Lightroom',
    category: 'Design & Creative',
    targetLevel: 'ADVANCED',
    currentLevel: 'BEGINNER',
    goal: 'Master manual camera controls, composition framing, and professional RAW editing workflow.',
  },
  {
    id: 'li_03',
    name: 'Acoustic Guitar Fingerpicking',
    category: 'Music & Audio',
    targetLevel: 'INTERMEDIATE',
    currentLevel: 'BEGINNER',
    goal: 'Learn folk and indie fingerstyle patterns and chord transitions.',
  },
];

export const MOCK_MATCHES = [
  {
    id: 'mat_01',
    user: {
      id: 'usr_002',
      name: 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      title: 'Bilingual Translator & Tech Enthusiast',
      location: 'Austin, TX',
      rating: 5.0,
      reviewsCount: 19,
    },
    matchScore: 98,
    teachesYou: 'Conversational Spanish (Native speaker)',
    wantsFromYou: 'React & Modern Frontend Architecture',
    sharedSchedule: 'Weekends, Evenings',
    bio: 'Native Spanish speaker from Madrid now living in the US. Eager to switch careers into tech and need mentorship in React!',
  },
  {
    id: 'mat_02',
    user: {
      id: 'usr_003',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      title: 'Commercial Portrait Photographer',
      location: 'Seattle, WA',
      rating: 4.9,
      reviewsCount: 31,
    },
    matchScore: 92,
    teachesYou: 'Digital Photography & Lightroom',
    wantsFromYou: 'Python & Data Structures',
    sharedSchedule: 'Saturday mornings & flexible weekdays',
    bio: 'Photographer with 8 years studio experience. Wanting to learn Python for automation and image sorting algorithms.',
  },
  {
    id: 'mat_03',
    user: {
      id: 'usr_004',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      title: 'Acoustic Guitarist & Singer-Songwriter',
      location: 'Nashville, TN',
      rating: 4.85,
      reviewsCount: 15,
    },
    matchScore: 89,
    teachesYou: 'Acoustic Guitar Fingerpicking',
    wantsFromYou: 'Classical Piano / Music Theory',
    sharedSchedule: 'Weekday nights',
    bio: 'Full-time musician teaching guitar chords and acoustic rhythm. Looking to improve my keyboard accompaniment skills.',
  },
];

export const MOCK_EXCHANGE_REQUESTS = {
  incoming: [
    {
      id: 'req_inc_01',
      sender: {
        id: 'usr_005',
        name: 'Liam Becker',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        location: 'Berlin / Remote',
        rating: 4.9,
      },
      theyOffer: 'German Conversation & Grammar',
      theyWant: 'React & Modern Frontend',
      proposedSchedule: 'Twice a week, 45 minutes each',
      message: 'Hello! Loved your profile. I am a UX designer looking to code my own prototypes in React, and I can teach you fluent German in return!',
      date: '2 hours ago',
      status: 'PENDING',
    },
    {
      id: 'req_inc_02',
      sender: {
        id: 'usr_006',
        name: 'Amara Okafor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        location: 'London, UK',
        rating: 5.0,
      },
      theyOffer: 'Digital Marketing & SEO Strategy',
      theyWant: 'Python Automation',
      proposedSchedule: 'Weekly 1-hour sessions',
      message: 'Hello! I need help writing web scraper scripts in Python for market research. I can guide you through marketing growth strategies.',
      date: '1 day ago',
      status: 'PENDING',
    },
  ],
  outgoing: [
    {
      id: 'req_out_01',
      recipient: {
        id: 'usr_009',
        name: 'Hannah Schmidt',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        location: 'Vienna, Austria',
        rating: 4.8,
      },
      youOffer: 'React & Frontend Architecture',
      youWant: 'Conversational German',
      proposedSchedule: 'Saturdays at 11 AM PST',
      message: 'Hallo Hannah! Would love to trade 1 hour of React code mentoring for 1 hour of German practice.',
      date: 'Yesterday',
      status: 'ACCEPTED',
    },
  ],
};

export const MOCK_ACTIVE_EXCHANGES = [
  {
    id: 'exc_01',
    partner: {
      id: 'usr_002',
      name: 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      email: 'carlos.r@example.com',
    },
    skillYouTeach: 'React Architecture',
    skillYouLearn: 'Conversational Spanish',
    sessionsCompleted: 4,
    totalSessionsPlanned: 8,
    nextSession: 'This Saturday at 11:00 AM PST',
    status: 'ACTIVE',
    notes: 'Last session covered Spanish subjunctive mood and React useEffect dependencies.',
  },
  {
    id: 'exc_02',
    partner: {
      id: 'usr_003',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      email: 'elena.rostova@example.com',
    },
    skillYouTeach: 'Python & Data Structures',
    skillYouLearn: 'Lightroom Color Grading',
    sessionsCompleted: 6,
    totalSessionsPlanned: 6,
    nextSession: 'Completed',
    status: 'COMPLETED',
    notes: 'All 6 sessions completed! Excellent mutual exchange.',
  },
];

export const MOCK_SCHEDULED_LESSONS = [
  {
    id: 'les_01',
    partnerName: 'Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    topic: 'Spanish Pronunciation & Accent Training',
    type: 'LEARNING',
    dateTime: 'Saturday, Nov 22, 11:00 AM — 12:00 PM PST',
    status: 'UPCOMING',
    meetingLink: 'https://meet.jit.si/skillswap-carlos-sarah',
  },
  {
    id: 'les_02',
    partnerName: 'Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    topic: 'React Custom Hooks & Context API',
    type: 'TEACHING',
    dateTime: 'Tuesday, Nov 25, 6:30 PM — 7:30 PM PST',
    status: 'UPCOMING',
    meetingLink: 'https://meet.jit.si/skillswap-carlos-sarah',
  },
  {
    id: 'les_03',
    partnerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    topic: 'Lightroom Tone Curves & HSL Adjustments',
    type: 'LEARNING',
    dateTime: 'Completed on Nov 15',
    status: 'COMPLETED',
  },
];

export const MOCK_MESSAGES = [
  {
    id: 'msg_01',
    partner: {
      id: 'usr_002',
      name: 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      status: 'Online',
    },
    thread: [
      { id: 't1', sender: 'Carlos', text: '¡Hola! Are we still set for Saturday at 11 AM?', time: '10:32 AM', isSelf: false },
      { id: 't2', sender: 'You', text: 'Yes, definitely! I prepared some flashcards for our conversation drill.', time: '10:35 AM', isSelf: true },
      { id: 't3', sender: 'Carlos', text: 'Awesome! And I have my React project repository ready for code review.', time: '10:36 AM', isSelf: false },
      { id: 't4', sender: 'You', text: 'Perfect. Looking forward to it!', time: '10:38 AM', isSelf: true },
    ],
  },
  {
    id: 'msg_02',
    partner: {
      id: 'usr_003',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      status: 'Offline',
    },
    thread: [
      { id: 't5', sender: 'Elena', text: 'Thanks again for the review! It was such a pleasure learning Python with you.', time: 'Nov 16', isSelf: false },
      { id: 't6', sender: 'You', text: 'Thank you Elena! I already edited 30 photos with the preset we made.', time: 'Nov 16', isSelf: true },
    ],
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'rev_01',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    skillTaught: 'Python & Data Structures',
    rating: 5,
    date: '3 days ago',
    comment: 'Sarah is an exceptional teacher! She explained complex data structures with easy real-world analogies. Patient, clear, and very knowledgeable.',
  },
  {
    id: 'rev_02',
    authorName: 'Tariq Mansour',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    skillTaught: 'React Architecture',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Transformed how I structure frontend applications. In just 3 sessions I understood state management much better than from months of YouTube tutorials.',
  },
  {
    id: 'rev_03',
    authorName: 'Maya Lin',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    skillTaught: 'Classical Piano Basics',
    rating: 4.8,
    date: '1 month ago',
    comment: 'Very encouraging teacher. She helped me overcome stage fright while reading beginner notation.',
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_01',
    type: 'SWAP_REQUEST',
    title: 'New Swap Proposal',
    message: 'Liam Becker sent you a skill exchange proposal for React.',
    time: '2 hours ago',
    isRead: false,
    link: '/app/requests',
  },
  {
    id: 'notif_02',
    type: 'SWAP_ACCEPTED',
    title: 'Proposal Accepted!',
    message: 'Carlos Rodriguez accepted your Spanish <-> React proposal.',
    time: 'Yesterday',
    isRead: false,
    link: '/app/exchanges',
  },
  {
    id: 'notif_03',
    type: 'REVIEW_RECEIVED',
    title: 'New 5-Star Review',
    message: 'Elena Rostova left a glowing review for your Python mentoring.',
    time: '3 days ago',
    isRead: true,
    link: '/app/feedback',
  },
];

export const MOCK_ADMIN_STATS = {
  totalUsers: 1420,
  activeSwapsThisMonth: 384,
  completedSwapsTotal: 1950,
  pendingReports: 3,
  disputeResolutionRate: '98.5%',
};

export const MOCK_ADMIN_USERS = [
  {
    id: 'usr_101',
    name: 'Michael Chang',
    email: 'm.chang@example.com',
    role: 'ROLE_USER',
    skillsCount: 4,
    swapsCount: 9,
    status: 'ACTIVE',
    rating: 4.8,
    joinedDate: 'Jan 15, 2026',
  },
  {
    id: 'usr_102',
    name: 'Devon Watts',
    email: 'devon.watts@example.com',
    role: 'ROLE_USER',
    skillsCount: 1,
    swapsCount: 0,
    status: 'BLOCKED',
    rating: 2.1,
    joinedDate: 'Feb 02, 2026',
    blockReason: 'Commercial spam and soliciting paid tutoring outside network rules',
  },
  {
    id: 'usr_103',
    name: 'Aisha Al-Mansoor',
    email: 'aisha@example.com',
    role: 'ROLE_USER',
    skillsCount: 6,
    swapsCount: 14,
    status: 'ACTIVE',
    rating: 5.0,
    joinedDate: 'Nov 12, 2025',
  },
  {
    id: 'usr_104',
    name: 'Jake Reynolds',
    email: 'jake.r@example.com',
    role: 'ROLE_USER',
    skillsCount: 2,
    swapsCount: 3,
    status: 'ACTIVE',
    rating: 4.6,
    joinedDate: 'Feb 10, 2026',
  },
];

export const MOCK_ADMIN_REPORTS = [
  {
    id: 'rep_01',
    reportedUser: {
      id: 'usr_102',
      name: 'Devon Watts',
      email: 'devon.watts@example.com',
    },
    reportingUser: {
      id: 'usr_002',
      name: 'Carlos Rodriguez',
    },
    category: 'Commercial Solicitation',
    status: 'PENDING',
    date: 'Feb 18, 2026',
    summary: 'User attempted to charge $40/hr via PayPal instead of doing a reciprocal skill swap.',
    evidence: 'Chat transcript: "Hey, I can just give you the guitar lessons directly if you send $40 to my Venmo instead of doing the code swap."',
  },
  {
    id: 'rep_02',
    reportedUser: {
      id: 'usr_105',
      name: 'Anonymous Trader',
      email: 'bot98@tempmail.com',
    },
    reportingUser: {
      id: 'usr_001',
      name: 'Sarah Chen',
    },
    category: 'Inappropriate Content / Spam',
    status: 'PENDING',
    date: 'Feb 19, 2026',
    summary: 'Skill listing contained repetitive automated promotional links.',
    evidence: 'Listing description contained repeated links to third-party survey sites.',
  },
  {
    id: 'rep_03',
    reportedUser: {
      id: 'usr_106',
      name: 'Tom Bradley',
      email: 'tom.b@example.com',
    },
    reportingUser: {
      id: 'usr_003',
      name: 'Elena Rostova',
    },
    category: 'No-show / Abandoned Session',
    status: 'RESOLVED',
    date: 'Feb 12, 2026',
    summary: 'User missed 3 scheduled exchange calls without prior cancellation or message.',
    resolution: 'Formal warning issued to user account. Attendance logged.',
  },
];

