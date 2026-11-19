import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: 'var(--spacing-3) 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--primary)' }}>
          🔄 Skill Swap Network
        </Link>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
          <Link to="/explore">Explore Skills</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/swaps">My Swaps</Link>
              <Link to="/profile">Profile</Link>
              <button
                onClick={logout}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  backgroundColor: 'var(--bg-card-hover)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--danger)',
                  fontWeight: 500
                }}
              >
                Logout ({user?.fullName?.split(' ')[0] || 'User'})
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                style={{
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-inverse)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

