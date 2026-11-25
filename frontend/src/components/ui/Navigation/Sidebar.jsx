import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { exchangeRequestService } from '../../../services/exchangeRequestService';
import { matchingService } from '../../../services/matchingService';
import './Sidebar.css';

export function Sidebar({ isAdmin = false }) {
  const { user, isAdmin: isAdminUser } = useAuth();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  const updateCounts = async () => {
    try {
      const incoming = await exchangeRequestService.getReceivedRequests();
      const pending = (incoming || []).filter(r => r.status === 'PENDING').length;
      setPendingRequestsCount(pending);

      const matches = await matchingService.getRecommendedMatches();
      setMatchesCount((matches || []).length);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    updateCounts();
    const handleUpdate = () => updateCounts();
    window.addEventListener('ssn_requests_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ssn_requests_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (isAdmin) {
    return (
      <aside className="app-sidebar">
        <div style={{ padding: '0 var(--space-3) var(--space-4)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
            Moderation Portal
          </span>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Admin Center</h3>
        </div>

        <span className="sidebar-section-title">Overview</span>
        <ul className="sidebar-nav-list">
          <li>
            <NavLink to="/admin" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">📊</span>
              <span>Platform Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">👥</span>
              <span>User Management</span>
            </NavLink>
          </li>
        </ul>

        <span className="sidebar-section-title">Moderation & Safety</span>
        <ul className="sidebar-nav-list">
          <li>
            <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">🚨</span>
              <span>Content Reports</span>
              <span className="sidebar-badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>3</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/moderation" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">⚖️</span>
              <span>Audit Trail & Bans</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    );
  }

  return (
    <aside className="app-sidebar">
      <span className="sidebar-section-title">Core</span>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/app/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">🏠</span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/matches" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">✨</span>
            <span>Recommended Matches</span>
            {matchesCount > 0 && <span className="sidebar-badge">{matchesCount}</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/find-partners" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">🔍</span>
            <span>Find Partners</span>
          </NavLink>
        </li>
      </ul>

      <span className="sidebar-section-title">My Skills</span>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/app/teaching" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">🎓</span>
            <span>Teaching Skills</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/learning" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">🎯</span>
            <span>Learning Goals</span>
          </NavLink>
        </li>
      </ul>

      <span className="sidebar-section-title">Swaps & Sessions</span>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/app/requests" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">📩</span>
            <span>Exchange Requests</span>
            {pendingRequestsCount > 0 && <span className="sidebar-badge">{pendingRequestsCount}</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/exchanges" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">🤝</span>
            <span>Active Exchanges</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/messages" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">💬</span>
            <span>Messages</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/schedule" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">📅</span>
            <span>Lesson Schedule</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/feedback" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">⭐</span>
            <span>Ratings & Feedback</span>
          </NavLink>
        </li>
      </ul>

      <span className="sidebar-section-title">Account</span>
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/app/profile" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">👤</span>
            <span>My Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/profile/edit" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">⚙️</span>
            <span>Edit Profile</span>
          </NavLink>
        </li>
      </ul>

      {/* Only visible to the designated platform administrator */}
      {isAdminUser && (
        <>
          <span className="sidebar-section-title">Administration</span>
          <ul className="sidebar-nav-list">
            <li>
              <NavLink to="/admin" className="sidebar-nav-item" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', color: '#4338ca', fontWeight: 600 }}>
                <span className="sidebar-icon">🛡️</span>
                <span>Admin Portal</span>
              </NavLink>
            </li>
          </ul>
        </>
      )}
    </aside>
  );
}

