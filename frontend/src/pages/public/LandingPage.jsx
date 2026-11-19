import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { MOCK_MATCHES, MOCK_REVIEWS, MOCK_SKILL_CATEGORIES } from '../../utils/mockData';
import './LandingPage.css';

export function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const popularSkills = [
    { name: 'React Architecture', category: 'Software Development', learners: 140 },
    { name: 'Python Automation', category: 'Software Development', learners: 185 },
    { name: 'Conversational Spanish', category: 'Languages', learners: 210 },
    { name: 'Digital Photography', category: 'Design & Creative', learners: 95 },
    { name: 'Acoustic Guitar', category: 'Music & Audio', learners: 120 },
    { name: 'UX Prototyping', category: 'Design & Creative', learners: 160 },
    { name: 'Japanese (JLPT N4)', category: 'Languages', learners: 85 },
    { name: 'Data Analysis with SQL', category: 'Software Development', learners: 190 },
  ];

  const filteredSkills = selectedCategory === 'All Categories'
    ? popularSkills
    : popularSkills.filter(s => s.category === selectedCategory);

  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <span>✨ 100% Free Peer-to-Peer Learning</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>No Paywalls • No Subscriptions</span>
          </div>

          <h1 className="hero-title">
            Teach What You Love. <br />
            <span className="hero-title-accent">Learn What You Want.</span>
          </h1>

          <p className="hero-subtitle">
            Skill Swap Network matches peers with complementary skills for direct, mutual knowledge exchange.
            Trade guitar lessons for Python coding, language practice for graphic design.
          </p>

          <div className="hero-cta-group">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Join Network Free
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="hero-stats-bar">
            <div className="hero-stat-item">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary-600)' }}>1,400+</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>Active Members</div>
            </div>
            <div className="hero-stat-item">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-accent-600)' }}>2,800+</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>Skills Exchanged</div>
            </div>
            <div className="hero-stat-item">
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary-600)' }}>$0.00</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>Cost Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How The Platform Works */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The 3-Step Swap Workflow
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
              How Skill Exchange Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              No credits, coins, or payments. Just a straightforward reciprocal agreement between two motivated people.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <div className="feature-step-card">
              <div className="step-number-badge">1</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>Publish Your Skills</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                List the expertise you can teach and what you want to learn, along with your proficiency level and general schedule availability.
              </p>
            </div>

            <div className="feature-step-card">
              <div className="step-number-badge" style={{ backgroundColor: 'var(--color-accent-600)' }}>2</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>Get Reciprocal Matches</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Our matching algorithm finds members who teach what you want to learn AND want to learn what you teach, giving you high-compatibility pairings.
              </p>
            </div>

            <div className="feature-step-card">
              <div className="step-number-badge">3</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>Swap & Build Reputation</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Coordinate virtual or in-person sessions, mark exchanges complete, and leave verified ratings to build trust in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Teaching Skills */}
      <section className="section-spacing">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-accent-600)', textTransform: 'uppercase' }}>
                Skills Directory
              </span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>Featured Teaching Skills</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Discover thousands of skills ready for direct swap right now.</p>
            </div>
            <Link to="/app/find-partners">
              <Button variant="outline" size="sm">Browse Full Directory →</Button>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {MOCK_SKILL_CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--color-primary-600)' : 'var(--border-subtle)',
                  backgroundColor: selectedCategory === cat ? 'var(--color-primary-50)' : 'var(--bg-surface)',
                  color: selectedCategory === cat ? 'var(--color-primary-700)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {filteredSkills.map(skill => (
              <div key={skill.name} className="card-surface" style={{ padding: 'var(--space-5)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-600)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {skill.category}
                </span>
                <h4 style={{ fontSize: 'var(--font-size-md)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {skill.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  <span>{skill.learners} members interested</span>
                  <Link to="/app/find-partners" style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>
                    Find Teachers →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live Match Preview & Algorithm Showcase */}
      <section className="section-spacing" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
                Algorithmic Pairing
              </span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, margin: 'var(--space-2) 0 var(--space-4)' }}>
                How Matching Works: True Reciprocity
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.7 }}>
                Unlike one-directional tutor marketplaces that demand payment per hour, Skill Swap Network computes <strong>two-way compatibility</strong>.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                <li style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-accent-600)', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Complementary Skill Sets:</strong> Matches occur when User A can teach what User B wants, and User B can teach what User A wants.
                  </span>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-accent-600)', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Schedule Compatibility:</strong> Cross-checks overlapping time slots and timezones for friction-free sessions.
                  </span>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-accent-600)', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Verified Reputation:</strong> Trust metrics based solely on completed exchanges and authentic peer reviews.
                  </span>
                </li>
              </ul>
              <Link to="/app/matches">
                <Button variant="primary" size="md">Test Match Engine Demo</Button>
              </Link>
            </div>

            {/* Live Card Sample */}
            <div style={{ backgroundColor: 'var(--bg-app)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Live Algorithmic Match Example
                </span>
                <span className="match-score-badge">98% Reciprocal Match</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <img
                  src={MOCK_MATCHES[0].user.avatar}
                  alt={MOCK_MATCHES[0].user.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{MOCK_MATCHES[0].user.name}</h4>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Carlos Rodriguez • ⭐ 5.0 (19 reviews)</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>He Teaches You:</span>
                  <SkillTag name="Conversational Spanish" type="wanted" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>You Teach Him:</span>
                  <SkillTag name="React Architecture" type="offered" />
                </div>
              </div>
              <Button variant="primary" size="sm" fullWidth>Propose Exchange Agreement</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Testimonials */}
      <section className="section-spacing">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
              Community Trust
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
              Real Reviews from Real Swappers
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {MOCK_REVIEWS.map(rev => (
              <Card key={rev.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <img
                    src={rev.authorAvatar}
                    alt={rev.authorName}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{rev.authorName}</h4>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-600)' }}>
                      Learned: {rev.skillTaught}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-3)' }}>
                  "{rev.comment}"
                </p>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  ⭐ {rev.rating}.0 • {rev.date}
                </div>
              </Card>
            ))}
          </div>

          {/* Call to Action Banner */}
          <div className="cta-banner">
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: '#fff', marginBottom: 'var(--space-3)' }}>
              Ready to Share What You Know?
            </h2>
            <p style={{ color: 'var(--color-primary-200)', maxWidth: '580px', margin: '0 auto var(--space-8)', fontSize: 'var(--font-size-md)' }}>
              Join hundreds of software engineers, musicians, linguists, and artists already swapping knowledge. Free forever.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Your Profile Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
