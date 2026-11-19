import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';

export function Home() {
  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)', color: 'var(--primary)' }}>
        Teach What You Love, Learn What You Want
      </h1>
      <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-muted)', marginBottom: 'var(--spacing-8)' }}>
        Skill Swap Network connects passionate individuals for reciprocal, 100% free peer-to-peer skill exchanges.
        No credits, no payments — just pure knowledge sharing.
      </p>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginBottom: 'var(--spacing-12)' }}>
        <Link
          to="/explore"
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
          }}
        >
          Explore Skills
        </Link>
        <Link
          to="/register"
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
          }}
        >
          Join Network
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)', textAlign: 'left' }}>
        <Card title="1. List Skills" subtitle="Offer & Request">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Tell the community what expertise you can teach and what topics you are eager to learn.
          </p>
        </Card>
        <Card title="2. Reciprocal Match" subtitle="Smart Pairing">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Discover partners whose desired skills match what you teach, and vice-versa.
          </p>
        </Card>
        <Card title="3. Exchange & Review" subtitle="Build Trust">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Propose a swap, coordinate learning sessions, and leave ratings to build community reputation.
          </p>
        </Card>
      </div>
    </div>
  );
}

