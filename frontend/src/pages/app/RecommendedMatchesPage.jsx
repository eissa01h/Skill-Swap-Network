import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { MatchCard } from '../../components/ui/Card/MatchCard';
import { Modal } from '../../components/ui/Modal/Modal';
import { Button } from '../../components/ui/Button/Button';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { matchingService } from '../../services/matchingService';
import { exchangeRequestService } from '../../services/exchangeRequestService';
import { friendService } from '../../services/friendService';

export function RecommendedMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [proposalSent, setProposalSent] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const [data, outgoing, friendList] = await Promise.all([
          matchingService.getRecommendedMatches(),
          exchangeRequestService.getSentRequests(),
          friendService.getFriends(),
        ]);
        setMatches(data || []);
        setSentRequests(outgoing || []);
        setFriends(friendList || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const getProposalStatus = (user) => {
    if (!user || !sentRequests || sentRequests.length === 0) return null;
    const matching = sentRequests.filter(r => {
      const idMatch = (r.recipient?.id && r.recipient.id === user.id) ||
                      (r.partner?.id && r.partner.id === user.id);
      const nameMatch = (r.recipient?.name && r.recipient.name.toLowerCase() === user.name.toLowerCase()) ||
                        (r.partner?.name && r.partner.name.toLowerCase() === user.name.toLowerCase());
      return idMatch || nameMatch;
    });
    if (matching.length === 0) return null;
    const active = matching.find(r => r.status === 'PENDING' || r.status === 'ACCEPTED');
    return active ? active.status : matching[0].status;
  };

  const handleCancelProposal = async (match) => {
    if (!match?.user || !sentRequests) return;
    const req = sentRequests.find(r => {
      const idMatch = (r.recipient?.id && r.recipient.id === match.user.id) ||
                      (r.partner?.id && r.partner.id === match.user.id);
      const nameMatch = (r.recipient?.name && r.recipient.name.toLowerCase() === match.user.name.toLowerCase()) ||
                        (r.partner?.name && r.partner.name.toLowerCase() === match.user.name.toLowerCase());
      return (idMatch || nameMatch) && r.status === 'PENDING';
    });

    if (!req) return;

    setCancellingId(match.user.id);
    try {
      await exchangeRequestService.cancelRequest(req.id);
      setSentRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err) {
      console.error('Failed to cancel proposal:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Please write a brief proposal message.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const created = await exchangeRequestService.createRequest({
        partner: selectedMatch.user,
        youOffer: selectedMatch.wantsFromYou,
        youWant: selectedMatch.teachesYou,
        message: message.trim(),
        proposedSchedule: '1 session per week',
      });
      if (created) {
        setSentRequests(prev => [created, ...(prev || [])]);
      }

      setProposalSent(true);
      setTimeout(() => {
        setProposalSent(false);
        setSelectedMatch(null);
        setMessage('');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Recommended Reciprocal Matches"
      subtitle="Members whose desired learning skills complement what you teach, calculated by our two-way matching engine."
    >
      <div style={{ backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-6)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span style={{ fontSize: '1.75rem' }}>✨</span>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-900)' }}>
          <strong>Smart Match Score Guarantee:</strong> These matches have an 85%+ score based on dual-topic reciprocity and overlapping availability schedules.
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Spinner />
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          title="No reciprocal matches found yet"
          description="Add more skills you can teach and skills you want to learn to increase match opportunities."
          actionText="Add Teaching Skills"
          onAction={() => window.location.href = '/app/teaching'}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              status={getProposalStatus(match.user)}
              isFriend={friends.some(f => (match.user?.id && f.id === match.user.id) || (match.user?.name && f.name?.toLowerCase() === match.user.name?.toLowerCase()))}
              isCancelling={cancellingId === match.user?.id}
              onProposeSwap={(m) => { setErrorMsg(''); setSelectedMatch(m); }}
              onCancelProposal={handleCancelProposal}
            />
          ))}
        </div>
      )}

      {/* Propose Swap Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => { setSelectedMatch(null); setErrorMsg(''); }}
        title={`Request Skill Swap with ${selectedMatch?.user?.name}`}
      >
        {proposalSent ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
            <h4 style={{ fontWeight: 700 }}>Proposal Successfully Delivered!</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              {selectedMatch?.user?.name} will receive a notification to review and accept your swap. Check your Outgoing Requests tab anytime.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendProposal} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {errorMsg && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <div><strong>Exchange:</strong> {selectedMatch?.teachesYou} ⇄ {selectedMatch?.wantsFromYou}</div>
              <div style={{ marginTop: '2px', color: 'var(--text-muted)' }}>Compatibility Score: {selectedMatch?.matchScore}%</div>
            </div>

            <Textarea
              label="Proposal Message & Meeting Preferences"
              required
              rows={4}
              placeholder="Hi! I noticed our high compatibility match. Would love to trade sessions on weekends..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" type="button" onClick={() => setSelectedMatch(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Swap Request'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}

export default RecommendedMatchesPage;
