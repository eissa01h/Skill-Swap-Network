import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Welcome, {user?.fullName || 'Member'}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your skill listings, explore reciprocal matches, and track active swaps.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
        <Card title="My Skills Inventory" subtitle="Skills you teach & skills you want">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)' }}>
            Keep your skills up-to-date to maximize matching accuracy.
          </p>
          <Link to="/profile" style={{ fontWeight: 600 }}>Manage My Skills →</Link>
        </Card>

        <Card title="Active Swap Proposals" subtitle="Incoming & outgoing requests">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)' }}>
            Review pending exchange requests or coordinate with existing partners.
          </p>
          <Link to="/swaps" style={{ fontWeight: 600 }}>View Swap Requests →</Link>
        </Card>

        <Card title="Find Learning Partners" subtitle="Search & Reciprocal Matches">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)' }}>
            Discover peers who want to learn what you teach and can teach what you need.
          </p>
          <Link to="/explore" style={{ fontWeight: 600 }}>Explore Directory →</Link>
        </Card>
      </div>
    </div>
  );
}

