import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PublicProfilePage } from './pages/public/PublicProfilePage';

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
          <Route path="/user/:id" element={<PublicProfilePage />} />

          {/* Authenticated Member App Routes (Protected) */}
          <Route path="/app/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/app/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/app/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/app/teaching" element={<ProtectedRoute><TeachingSkillsPage /></ProtectedRoute>} />
          <Route path="/app/learning" element={<ProtectedRoute><LearningInterestsPage /></ProtectedRoute>} />
          <Route path="/app/find-partners" element={<ProtectedRoute><FindPartnersPage /></ProtectedRoute>} />
          <Route path="/app/matches" element={<ProtectedRoute><RecommendedMatchesPage /></ProtectedRoute>} />
          <Route path="/app/requests" element={<ProtectedRoute><ExchangeRequestsPage /></ProtectedRoute>} />
          <Route path="/app/exchanges" element={<ProtectedRoute><MyExchangesPage /></ProtectedRoute>} />
          <Route path="/app/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/app/schedule" element={<ProtectedRoute><LessonSchedulePage /></ProtectedRoute>} />
          <Route path="/app/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path="/app/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Admin Moderation Portal Routes (Admin Protected) */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
          <Route path="/admin/reports/:id" element={<AdminRoute><AdminReportDetailPage /></AdminRoute>} />
          <Route path="/admin/moderation" element={<AdminRoute><AdminModerationPage /></AdminRoute>} />

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
