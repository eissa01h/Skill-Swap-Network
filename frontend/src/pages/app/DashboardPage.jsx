import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { StatCard } from '../../components/ui/Card/StatCard';
import { Card } from '../../components/ui/Card/Card';
import { MatchCard } from '../../components/ui/Card/MatchCard';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  MOCK_MATCHES,
  MOCK_EXCHANGE_REQUESTS,
  MOCK_SCHEDULED_LESSONS,
  MOCK_ACTIVE_EXCHANGES,
} from '../../utils/mockData';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout
      title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Member'}! 👋`}
      subtitle="Here is an overview of your active swaps, upcoming sessions, and top reciprocal matches."
      actions={
        <Link to="/app/matches">
          <Button variant="primary" size="md">
            View All Matches (3)
          </Button>
        </Link>
      }
    >
      {/* 1. Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <StatCard
          label="Active Exchanges"
          value="2"
          trend="1 session this week"
          icon="🤝"
          iconBg="var(--color-primary-50)"
          iconColor="var(--color-primary-600)"
        />
        <StatCard
          label="Completed Swaps"
          value="18"
          trend="+3 this month"
          icon="🎓"
          iconBg="var(--color-accent-50)"
          iconColor="var(--color-accent-600)"
        />
        <StatCard
          label="Community Rating"
          value="4.95"
          trend="24 verified reviews"
          icon="⭐"
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
        <StatCard
          label="Reciprocal Matches"
          value="3 New"
          trend="92%+ compatibility"
          icon="✨"
          iconBg="#f5f3ff"
          iconColor="#7c3aed"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        {/* Left Column: Recommended Matches & Exchange Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Top Reciprocal Match */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                Top Reciprocal Match Today
              </h3>
              <Link to="/app/matches" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                Explore All →
              </Link>
            </div>
            <MatchCard
              match={MOCK_MATCHES[0]}
              onProposeSwap={(m) => alert(`Proposing swap with ${m.user.name} for ${m.teachesYou}!`)}
            />
          </div>

          {/* Pending Incoming Requests */}
          <Card
            title="Pending Exchange Proposals"
            subtitle={`${MOCK_EXCHANGE_REQUESTS.incoming.length} incoming requests waiting for your review`}
            actions={
              <Link to="/app/requests">
                <Button variant="ghost" size="sm">Manage Requests →</Button>
              </Link>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              {MOCK_EXCHANGE_REQUESTS.incoming.map(req => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img
                      src={req.sender.avatar}
                      alt={req.sender.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{req.sender.name}</strong>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                        Offers: <strong>{req.theyOffer}</strong> • Wants: <strong>{req.theyWant}</strong>
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link to="/app/requests">
                      <Button variant="primary" size="sm">Review</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Next Session & Quick Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Next Lesson Card */}
          <Card title="Upcoming Lesson Session">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
              <img
                src={MOCK_SCHEDULED_LESSONS[0].avatar}
                alt={MOCK_SCHEDULED_LESSONS[0].partnerName}
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>
                  {MOCK_SCHEDULED_LESSONS[0].topic}
                </strong>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  with {MOCK_SCHEDULED_LESSONS[0].partnerName}
                </span>
              </div>
            </div>

            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              ⏰ <strong>{MOCK_SCHEDULED_LESSONS[0].dateTime}</strong>
            </div>

            <a
              href={MOCK_SCHEDULED_LESSONS[0].meetingLink}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="primary" size="sm" fullWidth>
                Join Video Meeting Link ↗
              </Button>
            </a>
          </Card>

          {/* Quick Access Links */}
          <Card title="Skill Management">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/app/teaching" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                <span>🎓 My Teaching Skills</span>
                <span style={{ fontWeight: 600 }}>3 active</span>
              </Link>
              <Link to="/app/learning" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-sm)' }}>
                <span>🎯 My Learning Goals</span>
                <span style={{ fontWeight: 600 }}>3 active</span>
              </Link>
              <Link to="/app/messages" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: 'var(--font-size-sm)' }}>
                <span>💬 Messages</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>1 unread</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
