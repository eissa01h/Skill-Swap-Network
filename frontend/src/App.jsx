import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Authenticated Application Pages
import { DashboardPage } from './pages/app/DashboardPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { EditProfilePage } from './pages/app/EditProfilePage';
import { TeachingSkillsPage } from './pages/app/TeachingSkillsPage';
import { LearningInterestsPage } from './pages/app/LearningInterestsPage';
import { FindPartnersPage } from './pages/app/FindPartnersPage';
import { RecommendedMatchesPage } from './pages/app/RecommendedMatchesPage';
import { ExchangeRequestsPage } from './pages/app/ExchangeRequestsPage';
import { MyExchangesPage } from './pages/app/MyExchangesPage';
import { MessagesPage } from './pages/app/MessagesPage';
import { LessonSchedulePage } from './pages/app/LessonSchedulePage';
import { FeedbackPage } from './pages/app/FeedbackPage';
import { NotificationsPage } from './pages/app/NotificationsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminReportDetailPage } from './pages/admin/AdminReportDetailPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Member App Routes */}
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
          <Route path="/app/profile/edit" element={<EditProfilePage />} />
          <Route path="/app/teaching" element={<TeachingSkillsPage />} />
          <Route path="/app/learning" element={<LearningInterestsPage />} />
          <Route path="/app/find-partners" element={<FindPartnersPage />} />
          <Route path="/app/matches" element={<RecommendedMatchesPage />} />
          <Route path="/app/requests" element={<ExchangeRequestsPage />} />
          <Route path="/app/exchanges" element={<MyExchangesPage />} />
          <Route path="/app/messages" element={<MessagesPage />} />
          <Route path="/app/schedule" element={<LessonSchedulePage />} />
          <Route path="/app/feedback" element={<FeedbackPage />} />
          <Route path="/app/notifications" element={<NotificationsPage />} />

          {/* Admin Moderation Portal Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/reports/:id" element={<AdminReportDetailPage />} />
          <Route path="/admin/moderation" element={<AdminModerationPage />} />

          {/* Backward Compatibility Redirects */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
          <Route path="/explore" element={<Navigate to="/app/find-partners" replace />} />
          <Route path="/swaps" element={<Navigate to="/app/requests" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
