import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Link } from 'react-router-dom';

export function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Profile & Skill Inventory',
      desc: 'List your skills in two categories: Teaching (skills you can share with proficiency rating) and Learning (skills you aspire to master). Add your availability notes and bio.',
    },
    {
      num: '02',
      title: 'Discover Reciprocal Matches',
      desc: 'Our engine identifies reciprocal pairs where both users have what each other wants. You can also manually search the directory by keyword, category, and minimum proficiency.',
    },
    {
      num: '03',
      title: 'Send a Skill Swap Proposal',
      desc: 'Submit a proposal specifying the skills to trade, proposed session cadence (e.g., 1 hour per week), and an introductory note.',
    },
    {
      num: '04',
      title: 'Coordinate & Learn',
      desc: 'Once accepted, use our direct messaging and lesson scheduler to arrange meeting links (Google Meet, Zoom, Jitsi) and track mutual progress.',
    },
    {
      num: '05',
      title: 'Mark Complete & Submit Ratings',
      desc: 'After sharing knowledge, both parties mark the swap as completed and submit an authentic 1-5 star review to maintain high community trust.',
    },
  ];

  return (
    <PublicLayout>
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
              Guide & Walkthrough
            </span>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginTop: 'var(--space-2)' }}>
              How Skill Swap Network Works
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', marginTop: 'var(--space-2)' }}>
              Everything you need to know about peer-to-peer skill swapping from start to finish.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
            {steps.map(s => (
              <div key={s.num} className="card-surface" style={{ padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary-600)', minWidth: '40px' }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{s.title}</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Card title="Community Safety & Guidelines" subtitle="Zero tolerance for commercial solicitation">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              <li>• <strong>No Monetary Payments:</strong> Asking for money or off-platform payment is grounds for permanent ban.</li>
              <li>• <strong>Punctuality:</strong> Respect your partner's time. Cancel or reschedule at least 24 hours in advance.</li>
              <li>• <strong>Mutual Respect:</strong> Create an inclusive and encouraging learning atmosphere.</li>
            </ul>
          </Card>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <Link to="/register">
              <Button variant="primary" size="lg">Ready to Swap? Join Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

