import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { StatCard } from '../../components/ui/Card/StatCard';
import { Card } from '../../components/ui/Card/Card';
import { MatchCard } from '../../components/ui/Card/MatchCard';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { skillService } from '../../services/skillService';
import { swapService } from '../../services/swapService';
import { matchService } from '../../services/mockApi';

export function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningInterests, setLearningInterests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeExchanges, setActiveExchanges] = useState([]);

  // Proposal modal state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [proposalMsg, setProposalMsg] = useState('');
  const [proposalSuccess, setProposalSuccess] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [teach, learn, match, inc, exc] = await Promise.all([
          skillService.getTeachingSkills(),
          skillService.getLearningInterests(),
          matchService.getRecommendedMatches(),
          swapService.getIncomingRequests(),
          swapService.getActiveExchanges(),
        ]);
        setTeachingSkills(teach);
        setLearningInterests(learn);
        setMatches(match);
        setIncomingRequests(inc);
        setActiveExchanges(exc);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Compute profile completion percentage
  const profileChecks = [
    { label: 'Full Name & Title', done: !!user?.fullName && !!user?.title },
    { label: 'Bio & Experience', done: !!user?.bio && user.bio.length > 20 },
    { label: 'Avatar Added', done: !!user?.avatarUrl },
    { label: 'Teaching Skills Listed', done: teachingSkills.length > 0 },
    { label: 'Learning Goals Defined', done: learningInterests.length > 0 },
    { label: 'Schedule Availability', done: !!user?.availability },
  ];
  const completedCount = profileChecks.filter(c => c.done).length;
  const completionPercent = Math.round((completedCount / profileChecks.length) * 100);

  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;

    await swapService.createProposal({
      partner: selectedMatch.user,
      youOffer: selectedMatch.wantsFromYou,
      youWant: selectedMatch.teachesYou,
      message: proposalMsg,
      proposedSchedule: selectedMatch.sharedSchedule,
    });

    setProposalSuccess(true);
    setTimeout(() => {
      setProposalSuccess(false);
      setSelectedMatch(null);
      setProposalMsg('');
    }, 1200);
  };

  const handleAcceptRequest = async (id) => {
    await swapService.acceptRequest(id);
    const updated = await swapService.getIncomingRequests();
    setIncomingRequests(updated);
  };

  const handleDeclineRequest = async (id) => {
    await swapService.declineRequest(id);
    const updated = await swapService.getIncomingRequests();
    setIncomingRequests(updated);
  };

  if (loading) {
    return (
      <AppLayout title="Loading Dashboard...">
        <Spinner size="lg" message="Loading your dashboard and match data..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Member'}! 👋`}
      subtitle="Your central command for peer skill exchanges, incoming proposals, and scheduled learning sessions."
      actions={
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link to="/app/teaching">
            <Button variant="outline" size="sm">+ Offer Skill</Button>
          </Link>
          <Link to="/app/matches">
            <Button variant="primary" size="sm">Find Matches ✨</Button>
          </Link>
        </div>
      }
    >
      {/* 1. Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <StatCard
          label="Active Exchanges"
          value={activeExchanges.filter(e => e.status === 'ACTIVE').length}
          trend="In progress"
          icon="🤝"
          iconBg="var(--color-primary-50)"
          iconColor="var(--color-primary-600)"
        />
        <StatCard
          label="Teaching Skills"
          value={teachingSkills.length}
          trend="Ready to share"
          icon="🎓"
          iconBg="var(--color-accent-50)"
          iconColor="var(--color-accent-600)"
        />
        <StatCard
          label="Learning Goals"
          value={learningInterests.length}
          trend="Topics active"
          icon="🎯"
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
        <StatCard
          label="Community Rating"
          value={`⭐ ${user?.averageRating || 4.95}`}
          trend={`${user?.totalReviews || 24} reviews`}
          icon="✨"
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
      </div>

      {/* 2. Profile Completion Widget */}
      <Card style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Profile Strength: {completionPercent}% Complete</h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Complete all profile details to boost your reciprocal matching ranking.
            </p>
          </div>
          <Link to="/app/profile/edit">
            <Button variant="outline" size="sm">Update Profile →</Button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-slate-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden', margin: 'var(--space-3) 0 var(--space-4)' }}>
          <div style={{ width: `${completionPercent}%`, height: '100%', backgroundColor: completionPercent === 100 ? 'var(--color-accent-500)' : 'var(--color-primary-600)', transition: 'width 0.4s ease' }} />
        </div>

        {/* Checklist */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
          {profileChecks.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: item.done ? 'var(--color-accent-700)' : 'var(--text-muted)' }}>
              <span>{item.done ? '✓' : '○'}</span>
              <span style={{ textDecoration: item.done ? 'none' : 'none' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        {/* Left Column: Top Match, Skills, Proposals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Top Suggested Partner */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                Top Reciprocal Match Today
              </h3>
              <Link to="/app/matches" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                View All Matches ({matches.length}) →
              </Link>
            </div>
            {matches.length > 0 && (
              <MatchCard
                match={matches[0]}
                onProposeSwap={(m) => setSelectedMatch(m)}
              />
            )}
          </div>

          {/* Pending Proposals Section */}
          <Card
            title="Pending Exchange Proposals"
            subtitle={`${incomingRequests.filter(r => r.status === 'PENDING').length} incoming request(s) awaiting your decision`}
            actions={
              <Link to="/app/requests">
                <Button variant="ghost" size="sm">Manage All →</Button>
              </Link>
            }
          >
            {incomingRequests.filter(r => r.status === 'PENDING').length === 0 ? (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', padding: 'var(--space-4) 0' }}>
                No pending incoming proposals. Explore the directory to initiate a swap!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                {incomingRequests.filter(r => r.status === 'PENDING').map(req => (
                  <div
                    key={req.id}
                    style={{
                      padding: 'var(--space-4)',
                      backgroundColor: 'var(--color-slate-50)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={req.sender.avatar}
                        alt={req.sender.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>{req.sender.name}</strong>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                          Offers: <strong>{req.theyOffer}</strong> ⇄ Wants: <strong>{req.theyWant}</strong>
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button variant="outline" size="sm" onClick={() => handleDeclineRequest(req.id)}>
                        Decline
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleAcceptRequest(req.id)}>
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Skills Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <Card
              title="Skills You Teach"
              subtitle={`${teachingSkills.length} listed`}
              actions={<Link to="/app/teaching"><Button variant="ghost" size="sm">Manage</Button></Link>}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {teachingSkills.map(s => (
                  <SkillTag key={s.id} name={s.name} level={s.level} type="offered" />
                ))}
              </div>
            </Card>

            <Card
              title="Skills You Want"
              subtitle={`${learningInterests.length} goals`}
              actions={<Link to="/app/learning"><Button variant="ghost" size="sm">Manage</Button></Link>}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {learningInterests.map(i => (
                  <SkillTag key={i.id} name={i.name} level={i.targetLevel} type="wanted" />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Upcoming Lessons & Chronological Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Upcoming Lesson Card */}
          <Card title="Upcoming Lesson Session">
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-primary-200)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary-700)', textTransform: 'uppercase' }}>
                Next Meeting
              </span>
              <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginTop: '2px' }}>
                Conversational Spanish & Grammar
              </h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                with Carlos Rodriguez • Saturday, 11:00 AM PST
              </p>
            </div>

            <a
              href="https://meet.jit.si/skillswap-carlos-sarah"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="primary" size="md" fullWidth>
                Join Video Meeting Room ↗
              </Button>
            </a>
          </Card>

          {/* Chronological Recent Activity Stream */}
          <Card title="Recent Activity">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>🎉</span>
                <div>
                  <strong style={{ fontSize: 'var(--font-size-xs)', display: 'block' }}>Swap Agreement Accepted</strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    Carlos Rodriguez accepted your proposal to swap Spanish for React.
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Yesterday</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>⭐</span>
                <div>
                  <strong style={{ fontSize: 'var(--font-size-xs)', display: 'block' }}>New 5-Star Review Received</strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    Elena Rostova submitted a review for your Python mentoring.
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>3 days ago</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>🎓</span>
                <div>
                  <strong style={{ fontSize: 'var(--font-size-xs)', display: 'block' }}>Exchange Completed</strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    Completed 6 sessions of Python & Lightroom with Elena.
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Nov 15</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Proposal Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={`Request Skill Swap with ${selectedMatch?.user?.name}`}
      >
        {proposalSuccess ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2rem' }}>🎉</div>
            <h4 style={{ fontWeight: 700, marginTop: 'var(--space-2)' }}>Proposal Successfully Sent!</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              {selectedMatch?.user?.name} has been notified and can accept or schedule sessions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendProposal} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <div><strong>Exchange:</strong> You teach {selectedMatch?.wantsFromYou} ⇄ They teach {selectedMatch?.teachesYou}</div>
              <div style={{ marginTop: '2px', color: 'var(--text-muted)' }}>Matching Score: {selectedMatch?.matchScore}% Reciprocal</div>
            </div>

            <Textarea
              label="Introductory Message & Availability"
              required
              rows={4}
              placeholder="Hi! I saw our matching skills. I can offer 1 hour per week on weekends..."
              value={proposalMsg}
              onChange={(e) => setProposalMsg(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="outline" onClick={() => setSelectedMatch(null)}>Cancel</Button>
              <Button type="submit" variant="primary">Send Proposal</Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}
