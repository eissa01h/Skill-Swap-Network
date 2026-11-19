import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_TEACHING_SKILLS, MOCK_LEARNING_INTERESTS, MOCK_REVIEWS } from '../../utils/mockData';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <AppLayout
      title="My Member Profile"
      subtitle="This is how other learners and teachers see you across Skill Swap Network."
      actions={
        <Link to="/app/profile/edit">
          <Button variant="primary" size="md">
            ✏️ Edit Profile
          </Button>
        </Link>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        {/* Left Column: Avatar & Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <img
                src={user?.avatarUrl}
                alt={user?.fullName}
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--color-primary-100)',
                  marginBottom: 'var(--space-3)',
                }}
              />
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{user?.fullName}</h2>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                {user?.title || 'Community Member'}
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                📍 {user?.location}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', margin: 'var(--space-4) 0', padding: 'var(--space-3) 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ⭐ {user?.averageRating || 4.95}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.totalReviews || 24} Reviews</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-accent-600)' }}>
                    {user?.completedSwaps || 18}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Swaps Done</div>
                </div>
              </div>

              <div style={{ textAlign: 'left', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                <strong>Availability:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{user?.availability}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Bio, Skills & Verified Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card title="About Me">
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {user?.bio}
            </p>
          </Card>

          {/* Teaching Skills */}
          <Card
            title="Skills I Teach"
            subtitle="Expertise offered to the community for reciprocal learning"
            actions={
              <Link to="/app/teaching">
                <Button variant="ghost" size="sm">Manage →</Button>
              </Link>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {MOCK_TEACHING_SKILLS.map(skill => (
                <div key={skill.id} style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: 'var(--font-size-sm)' }}>{skill.name}</strong>
                    <SkillTag name={skill.level} type="offered" />
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{skill.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Interests */}
          <Card
            title="Skills I Want to Learn"
            subtitle="Topics and disciplines currently seeking learning partners for"
            actions={
              <Link to="/app/learning">
                <Button variant="ghost" size="sm">Manage →</Button>
              </Link>
            }
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {MOCK_LEARNING_INTERESTS.map(int => (
                <SkillTag key={int.id} name={int.name} level={int.targetLevel} type="wanted" />
              ))}
            </div>
          </Card>

          {/* Verified Community Reviews */}
          <Card title="Verified Swap Reviews">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              {MOCK_REVIEWS.map(rev => (
                <div key={rev.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <strong style={{ fontSize: 'var(--font-size-sm)' }}>{rev.authorName}</strong>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-600)', fontWeight: 500, marginBottom: 'var(--space-1)' }}>
                    Exchange: {rev.skillTaught} • ⭐ {rev.rating}.0
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
