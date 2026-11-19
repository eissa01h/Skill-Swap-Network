import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '../Button/Button';
import './Navbar.css';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, loginAsMember, loginAsAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/', '/about', '/how-it-works', '/login', '/register'].includes(location.pathname);

  return (
    <header className="app-navbar">
      {/* Interactive Evaluation / Demo Role Switcher Bar */}
      <div className="demo-role-banner">
        <span>⚡ <strong>Live Prototype Mode</strong> (Software Engineering Project)</span>
        <div className="demo-role-badges">
          <span style={{ opacity: 0.8 }}>Preview as:</span>
          <button
            type="button"
            className={`demo-role-btn ${isAuthenticated && !isAdmin ? 'active' : ''}`}
            onClick={loginAsMember}
          >
            👤 Member (Sarah)
          </button>
          <button
            type="button"
            className={`demo-role-btn ${isAdmin ? 'active' : ''}`}
            onClick={loginAsAdmin}
          >
            🛡️ Admin (David)
          </button>
          <button
            type="button"
            className={`demo-role-btn ${!isAuthenticated ? 'active' : ''}`}
            onClick={logout}
          >
            🌐 Public Guest
          </button>
        </div>
      </div>

      <div className="container">
        <div className="navbar-inner">
          <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/app/dashboard') : '/'} className="navbar-brand">
            <div className="brand-icon">🔄</div>
            <span>SkillSwap</span>
          </Link>

          {/* Navigation Links */}
          <nav className="navbar-nav">
            {(!isAuthenticated || isPublicPage) && (
              <>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                <Link to="/how-it-works" className={`nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}>How It Works</Link>
                <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
                <Link to="/app/find-partners" className="nav-link">Explore Skills</Link>
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/app/dashboard" className={`nav-link ${location.pathname === '/app/dashboard' ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/app/matches" className={`nav-link ${location.pathname === '/app/matches' ? 'active' : ''}`}>Matches</Link>
                <Link to="/app/find-partners" className={`nav-link ${location.pathname === '/app/find-partners' ? 'active' : ''}`}>Find Partners</Link>
                <Link to="/app/requests" className={`nav-link ${location.pathname === '/app/requests' ? 'active' : ''}`}>Requests</Link>
                <Link to="/app/messages" className={`nav-link ${location.pathname === '/app/messages' ? 'active' : ''}`}>Messages</Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Overview</Link>
                <Link to="/admin/users" className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}>Users</Link>
                <Link to="/admin/reports" className={`nav-link ${location.pathname === '/admin/reports' ? 'active' : ''}`}>Reports Queue</Link>
                <Link to="/admin/moderation" className={`nav-link ${location.pathname === '/admin/moderation' ? 'active' : ''}`}>Audit Log</Link>
              </>
            )}
          </nav>

          {/* Actions & Profile */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Link to={isAdmin ? '/admin' : '/app/profile'} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <img
                      src={user?.avatarUrl}
                      alt={user?.fullName}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid var(--border-subtle)',
                      }}
                    />
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} style={{ fontSize: 'var(--font-size-xs)' }}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}

            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/how-it-works" onClick={() => setMobileOpen(false)}>How It Works</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/app/find-partners" onClick={() => setMobileOpen(false)}>Find Partners</Link>
            {isAuthenticated && (
              <>
                <Link to="/app/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/app/matches" onClick={() => setMobileOpen(false)}>Recommended Matches</Link>
                <Link to="/app/requests" onClick={() => setMobileOpen(false)}>Exchange Requests</Link>
                <Link to="/app/messages" onClick={() => setMobileOpen(false)}>Messages</Link>
                <Link to="/app/profile" onClick={() => setMobileOpen(false)}>My Profile</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
