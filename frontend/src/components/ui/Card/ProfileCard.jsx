import React from 'react';
import './Card.css';
import { Button } from '../Button/Button';

export function ProfileCard({
  user,
  onProposeSwap,
  onViewProfile,
  className = '',
}) {
  return (
    <div className={`ui-card ui-card-hover ${className}`} style={{ gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <img
          src={user.avatarUrl || user.avatar}
          alt={user.fullName || user.name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-full)',
            objectFit: 'cover',
            border: '2px solid var(--border-subtle)',
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.fullName || user.name}
          </h4>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {user.location} • ⭐ {user.averageRating || user.rating} ({user.totalReviews || user.reviewsCount} reviews)
          </p>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)', fontWeight: 500 }}>
            {user.title || 'Community Member'}
          </span>
        </div>
      </div>

      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {user.bio}
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
        {onProposeSwap && (
          <Button variant="primary" size="sm" fullWidth onClick={() => onProposeSwap(user)}>
            Propose Swap
          </Button>
        )}
        {onViewProfile && (
          <Button variant="outline" size="sm" onClick={() => onViewProfile(user)}>
            Profile
          </Button>
        )}
      </div>
    </div>
  );
}
