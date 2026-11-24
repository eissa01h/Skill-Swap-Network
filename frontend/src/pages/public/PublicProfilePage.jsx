import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { profileService } from '../../services/profileService';
import { messageService } from '../../services/messageService';
import { friendService } from '../../services/friendService';
import { MOCK_REVIEWS } from '../../utils/mockData';

export function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canText, setCanText] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [togglingFriend, setTogglingFriend] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getPublicProfile(id);
        setProfile(data);
        if (data) {
          const targetId = data.id || id;
          const targetName = data.name || data.fullName || '';
          const [eligible, friend] = await Promise.all([
            messageService.canMessagePartner(targetId, targetName),
            friendService.isFriend(targetId, targetName),
          ]);
          setCanText(eligible);
          setIsFriend(friend);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  const handleToggleFriend = async () => {
    if (!profile) return;
    setTogglingFriend(true);
    try {
      const targetId = profile.id || id;
      const targetName = profile.name || profile.fullName || 'Member';
      if (isFriend) {
        await friendService.removeFriend(targetId);
        setIsFriend(false);
      } else {
        await friendService.addFriend({
          id: targetId,
          name: targetName,
          avatar: profile.avatar || profile.avatarUrl,
          title: profile.title,
        });
        setIsFriend(true);
      }
      const eligible = await messageService.canMessagePartner(targetId, targetName);
      setCanText(eligible);
    } finally {
      setTogglingFriend(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container" style={{ padding: 'var(--space-16) 0' }}>
          <Spinner size="lg" message="Loading member public profile..." />
        </div>
      </PublicLayout>
    );
  }

  if (!profile) {
    return (
      <PublicLayout>
        <div className="container" style={{ padding: 'var(--space-16) var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>👤</div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Profile Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
            We could not find the public profile you were looking for.
          </p>
          <Link to="/app/find-partners" style={{ marginTop: 'var(--space-6)', display: 'inline-block' }}>
            <Button variant="primary">Browse Partner Directory</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', maxWidth: '960px' }}>
        {/* Public Notice Banner */}
        <div style={{ backgroundColor: 'var(--color-slate-100)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>👁️ <strong>Public Community Profile</strong> — Private contact info & settings are securely hidden.</span>
          <Link to="/app/profile" style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>
            Return to Private Account →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          {/* Left Column: Avatar & Meta */}
          <Card>
            <div style={{ textAlign: 'center' }}>
              <img
                src={profile?.avatar || profile?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                alt={profile?.name || profile?.fullName || 'Community Member'}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--color-primary-100)',
                  marginBottom: 'var(--space-3)',
                }}
              />
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                {profile?.name || profile?.fullName || 'Community Member'}
              </h2>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                {profile?.title || 'Community Member'}
              </p>
              {profile?.location && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                  📍 {profile.location}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', margin: 'var(--space-4) 0', padding: 'var(--space-3) 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>⭐ {profile.rating}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{profile.reviewsCount || 19} Reviews</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-accent-600)' }}>
                    {profile.mutualMatch ? 'Mutual Match' : 'Active'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
                {canText ? (
                  <Link
                    to={`/app/messages?partnerId=${profile?.id}&partnerName=${encodeURIComponent(profile?.name || profile?.fullName || 'Partner')}&avatar=${encodeURIComponent(profile?.avatar || profile?.avatarUrl || '')}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      style={{
                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 600,
                      }}
                    >
                      💬 Direct Message & Text
                    </Button>
                  </Link>
                ) : (
                  <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    🔒 Direct messaging unlocks when a swap proposal is accepted or you become friends.
                  </div>
                )}

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={handleToggleFriend}
                  loading={togglingFriend}
                  style={{
                    borderColor: isFriend ? '#fbcfe8' : 'var(--border-subtle)',
                    backgroundColor: isFriend ? '#fdf2f8' : 'transparent',
                    color: isFriend ? '#db2777' : 'var(--text-secondary)',
                    fontWeight: isFriend ? 600 : 500,
                  }}
                >
                  {isFriend ? '⭐ Friend (Connected)' : '+ Add as Friend to Text'}
                </Button>

                <Link to="/app/find-partners" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="md" fullWidth>
                    Propose Skill Swap
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Right Column: Bio, Skills & Verified Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card title="Introduction & Bio">
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {profile.bio}
              </p>
            </Card>

            <Card title="Teaching Expertise (Offered Skills)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {profile.teachingSkills ? (
                  profile.teachingSkills.map((s, idx) => (
                    <SkillTag key={idx} name={s.name} level={s.level} type="offered" />
                  ))
                ) : (
                  <SkillTag name={profile.teaches || 'Skill Sharing'} level="ADVANCED" type="offered" />
                )}
              </div>
            </Card>

            <Card title="Desired Learning Topics">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {profile.learningGoals ? (
                  profile.learningGoals.map((g, idx) => (
                    <SkillTag key={idx} name={g.name} level={g.targetLevel} type="wanted" />
                  ))
                ) : (
                  <SkillTag name={profile.wants || 'Languages & Code'} level="INTERMEDIATE" type="wanted" />
                )}
              </div>
            </Card>

            <Card title="Community Reviews">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {MOCK_REVIEWS.slice(0, 2).map(rev => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: 'var(--font-size-sm)' }}>{rev.authorName}</strong>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: '#f59e0b', fontWeight: 700 }}>⭐ {rev.rating}.0</span>
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
      </div>
    </PublicLayout>
  );
}

