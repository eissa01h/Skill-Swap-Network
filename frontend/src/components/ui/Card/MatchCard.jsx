import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import { Button } from '../Button/Button';
import { SkillTag } from '../SkillTag/SkillTag';

export function MatchCard({
  match,
  onProposeSwap,
  onCancelProposal,
  isCancelling = false,
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
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
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
          {onCancelProposal && (
            <Button
              variant="outline"
              size="md"
              onClick={() => onCancelProposal(match)}
              loading={isCancelling}
              title="Cancel proposal"
              style={{
                color: '#dc2626',
                borderColor: '#fca5a5',
                backgroundColor: '#fef2f2',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              ✕ Cancel
            </Button>
          )}
        </div>
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

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <Link
          to={`/app/messages?partnerId=${user.id}&partnerName=${encodeURIComponent(user.name)}&avatar=${encodeURIComponent(user.avatar)}`}
          style={{ flex: 1, textDecoration: 'none' }}
        >
          <Button variant="outline" size="sm" fullWidth>
            💬 Text
          </Button>
        </Link>
        <Link to={`/user/${user.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <Button variant="outline" size="sm" fullWidth>
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}

