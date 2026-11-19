import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { MatchCard } from '../../components/ui/Card/MatchCard';
import { Modal } from '../../components/ui/Modal/Modal';
import { Button } from '../../components/ui/Button/Button';
import { Textarea } from '../../components/ui/Input/Textarea';
import { MOCK_MATCHES } from '../../utils/mockData';

export function RecommendedMatchesPage() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [proposalSent, setProposalSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendProposal = (e) => {
    e.preventDefault();
    setProposalSent(true);
    setTimeout(() => {
      setProposalSent(false);
      setSelectedMatch(null);
      setMessage('');
    }, 1200);
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {MOCK_MATCHES.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            onProposeSwap={(m) => setSelectedMatch(m)}
          />
        ))}
      </div>

      {/* Propose Swap Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={`Request Skill Swap with ${selectedMatch?.user?.name}`}
      >
        {proposalSent ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
            <h4 style={{ fontWeight: 700 }}>Proposal Successfully Delivered!</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              {selectedMatch?.user?.name} will receive a notification to review and accept your swap.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendProposal} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
              <Button variant="outline" onClick={() => setSelectedMatch(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Swap Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}
