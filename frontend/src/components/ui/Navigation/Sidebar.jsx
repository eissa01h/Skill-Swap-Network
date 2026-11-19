import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Sidebar.css';

export function Sidebar({ isAdmin = false }) {
  const { user } = useAuth();

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
            <span className="sidebar-badge">3</span>
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
            <span className="sidebar-badge">2</span>
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
    </aside>
  );
}

