import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card } from '../../components/ui/Card/Card';

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
            Our Mission & Philosophy
          </span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-6)' }}>
            Empowering Democratized Learning Through Direct Reciprocity
          </h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-8)' }}>
            Skill Swap Network was conceived to challenge commercialized learning. We believe that everyone has something valuable to teach, and everyone has a passion they want to pursue.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
            <Card title="Zero Financial Barriers">
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                Knowledge shouldn't be gated behind costly per-hour subscriptions or artificial currency tokens. Our platform remains 100% free with direct mutual exchanges.
              </p>
            </Card>

            <Card title="Human-to-Human Connection">
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                Pre-recorded courses have low completion rates. Real-time peer collaboration provides accountability, genuine feedback, and personalized pacing.
              </p>
            </Card>
          </div>

          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Core Architectural Principles
          </h2>
          <div className="card-surface" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li><strong>🛡️ Safety & Integrity:</strong> Dedicated community moderation queue and verified exchange ratings.</li>
              <li><strong>⚡ Clean Architecture:</strong> Rigorous 3-layer decoupled design ensuring reliable, high-performance interactions.</li>
              <li><strong>✨ Smart Reciprocity:</strong> Algorithmic pairing that eliminates dead-end proposals.</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

