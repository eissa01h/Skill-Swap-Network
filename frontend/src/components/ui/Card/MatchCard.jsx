import React from 'react';
import './Card.css';
import { Button } from '../Button/Button';
import { SkillTag } from '../SkillTag/SkillTag';

export function MatchCard({
  match,
  onProposeSwap,
  status,
  className = '',
}) {
  const { user, matchScore, teachesYou, wantsFromYou, sharedSchedule, bio } = match;
  const isPending = status === 'PENDING';
  const isAccepted = status === 'ACCEPTED';

  return (
    <div className={`ui-card ui-card-hover match-card ${className}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-full)',
              objectFit: 'cover',
            }}
          />
          <div>
            <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{user.name}</h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {user.location} • ⭐ {user.rating} ({user.reviewsCount} reviews)
            </p>
          </div>
        </div>
        <span className="match-score-badge">
          ✨ {matchScore}% Reciprocal Match
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-accent-700)', fontWeight: 700, marginBottom: '2px' }}>
            THEY CAN TEACH YOU
          </span>
          <SkillTag name={teachesYou} type="wanted" />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-primary-700)', fontWeight: 700, marginBottom: '2px' }}>
            THEY WANT TO LEARN
          </span>
          <SkillTag name={wantsFromYou} type="offered" />
        </div>
      </div>

      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
        <strong>Available:</strong> {sharedSchedule}
      </p>

      {isPending ? (
        <Button
          variant="outline"
          size="md"
          fullWidth
          disabled
          style={{
            backgroundColor: '#f1f5f9',
            color: '#475569',
            borderColor: '#cbd5e1',
            cursor: 'not-allowed',
            fontWeight: 600,
          }}
        >
          ✓ Proposal Sent
        </Button>
      ) : isAccepted ? (
        <Button
          variant="outline"
          size="md"
          fullWidth
          disabled
          style={{
            backgroundColor: '#f0fdf4',
            color: '#15803d',
            borderColor: '#bbf7d0',
            fontWeight: 600,
          }}
        >
          🤝 Swap Active
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onProposeSwap(match)}
        >
          Request Skill Swap
        </Button>
      )}
    </div>
  );
}

