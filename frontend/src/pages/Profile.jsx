import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';

export function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>My Profile & Skills</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal bio, contact info, and listed teaching & learning skills.</p>
      </div>

      <Card title={user?.fullName || 'User Profile'} subtitle={user?.email}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>

          <div>
            <strong>Bio:</strong>
            <p style={{ color: 'var(--text-muted)' }}>{user?.bio || 'No bio added yet.'}</p>
          </div>
          <div>
            <strong>Availability:</strong>
            <p style={{ color: 'var(--text-muted)' }}>{user?.availability || 'Flexible'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

