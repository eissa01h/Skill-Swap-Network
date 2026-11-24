import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { Card } from '../../components/ui/Card/Card';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Textarea } from '../../components/ui/Input/Textarea';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { searchService } from '../../services/searchService';
import { exchangeRequestService } from '../../services/exchangeRequestService';
import { teachingSkillService } from '../../services/teachingSkillService';
import { MOCK_SKILL_CATEGORIES } from '../../utils/mockData';

export function FindPartnersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [minRating, setMinRating] = useState('0');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal state
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [myTeachingSkills, setMyTeachingSkills] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [proposalMsg, setProposalMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true);
      try {
        const [results, mySkills, outgoing] = await Promise.all([
          searchService.searchPartners({
            query: searchTerm,
            category,
            minRating: Number(minRating),
          }),
          teachingSkillService.getTeachingSkills(),
          exchangeRequestService.getSentRequests(),
        ]);
        setPartners(results || []);

        setMyTeachingSkills(mySkills || []);
        if (mySkills && mySkills.length > 0) {
          setSelectedOffer(mySkills[0].name);
        }
        setSentRequests(outgoing || []);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, [searchTerm, category, minRating]);

  const handleOpenProposal = (partner) => {
    setSelectedPartner(partner);
    setProposalMsg(`Hi ${partner.name}! I'd love to swap skills with you. I can offer mentoring in ${myTeachingSkills[0]?.name || 'web development'} in exchange for ${partner.teaches}.`);
  };

  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (!selectedPartner) return;

    setSending(true);
    try {
      const created = await exchangeRequestService.createRequest({
        partner: selectedPartner,
        youOffer: selectedOffer,
        youWant: selectedPartner.teaches,
        message: proposalMsg,
        proposedSchedule: selectedPartner.availability || 'Weekends',
      });
      if (created) {
        setSentRequests(prev => [created, ...(prev || [])]);
      }
      setProposalSuccess(true);
      setTimeout(() => {
        setProposalSuccess(false);
        setSelectedPartner(null);
        setProposalMsg('');
      }, 1200);
    } finally {
      setSending(false);
    }
  };

  const handleCancelProposal = async (partner) => {
    if (!partner || !sentRequests) return;
    const req = sentRequests.find(r => {
      const idMatch = (r.recipient?.id && r.recipient.id === partner.id) ||
                      (r.partner?.id && r.partner.id === partner.id);
      const nameMatch = (r.recipient?.name && r.recipient.name.toLowerCase() === partner.name.toLowerCase()) ||
                        (r.partner?.name && r.partner.name.toLowerCase() === partner.name.toLowerCase());
      return (idMatch || nameMatch) && r.status === 'PENDING';
    });

    if (!req) return;

    setCancellingId(partner.id);
    try {
      await exchangeRequestService.cancelRequest(req.id);
      setSentRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err) {
      console.error('Failed to cancel proposal:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const getProposalStatus = (partner) => {
    if (!partner || !sentRequests || sentRequests.length === 0) return null;
    const matching = sentRequests.filter(r => {
      const idMatch = (r.recipient?.id && r.recipient.id === partner.id) ||
                      (r.partner?.id && r.partner.id === partner.id);
      const nameMatch = (r.recipient?.name && r.recipient.name.toLowerCase() === partner.name.toLowerCase()) ||
                        (r.partner?.name && r.partner.name.toLowerCase() === partner.name.toLowerCase());
      return idMatch || nameMatch;
    });
    if (matching.length === 0) return null;
    const active = matching.find(r => r.status === 'PENDING' || r.status === 'ACCEPTED');
    return active ? active.status : matching[0].status;
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All Categories');
    setMinRating('0');
  };

  return (
    <AppLayout
      title="Find Learning Partners"
      subtitle="Search the community directory by topic, category, and minimum rating to propose a direct skill exchange."
    >
      {/* Search & Multi-Filter Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Input
          placeholder="Search by topic, skill, or partner name (e.g. Spanish, Python, Carlos)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startIcon="🔍"
        />
        <Select
          options={MOCK_SKILL_CATEGORIES}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Select
          options={[
            { value: '0', label: 'All Ratings' },
            { value: '4.8', label: '⭐ 4.8 & Above' },
            { value: '5.0', label: '⭐ 5.0 Only' },
          ]}
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner size="lg" message="Searching member directory..." />
      ) : partners.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Partners Match Your Filters"
          description="Try broadening your search term or selecting 'All Categories' to discover more community members."
          actionLabel="Reset Search Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
          {partners.map(p => {
            const proposalStatus = getProposalStatus(p);
            const isPending = proposalStatus === 'PENDING';
            const isAccepted = proposalStatus === 'ACCEPTED';

            return (
              <Card key={p.id} hoverable style={{ gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img
                      src={p.avatar}
                      alt={p.name}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{p.name}</h3>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        📍 {p.location} • ⭐ {p.rating} ({p.reviewsCount} reviews)
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    {p.mutualMatch && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-accent-100)', color: 'var(--color-accent-700)', textTransform: 'uppercase' }}>
                        ✨ Mutual Match
                      </span>
                    )}
                    {isPending && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        ⏳ Proposal Sent
                      </span>
                    )}
                    {isAccepted && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        🤝 Swap Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Exchange Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>TEACHES:</span>
                    <SkillTag name={p.teaches} type="wanted" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>WANTS:</span>
                    <SkillTag name={p.wants} type="offered" />
                  </div>
                </div>

                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.bio}
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
                  {isPending ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        style={{
                          flex: 1,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          borderColor: '#cbd5e1',
                          cursor: 'not-allowed',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--space-1)',
                        }}
                      >
                        ✓ Proposal Sent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelProposal(p)}
                        loading={cancellingId === p.id}
                        title="Cancel and withdraw proposal"
                        style={{
                          color: '#dc2626',
                          borderColor: '#fca5a5',
                          backgroundColor: '#fef2f2',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✕ Cancel
                      </Button>
                    </>
                  ) : isAccepted ? (
                    <Link to="/app/exchanges" style={{ flex: 1, display: 'flex' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        style={{
                          backgroundColor: '#f0fdf4',
                          color: '#15803d',
                          borderColor: '#bbf7d0',
                          fontWeight: 600,
                        }}
                      >
                        Active Swap →
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="primary" size="sm" fullWidth onClick={() => handleOpenProposal(p)}>
                      Propose Swap
                    </Button>
                  )}
                  <Link
                    to={`/app/messages?partnerId=${p.id}&partnerName=${encodeURIComponent(p.name)}&avatar=${encodeURIComponent(p.avatar)}`}
                    title={`Send text message to ${p.name}`}
                  >
                    <Button variant="outline" size="sm" style={{ whiteSpace: 'nowrap' }}>
                      💬 Text
                    </Button>
                  </Link>
                  <Link to={`/user/${p.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Propose Swap Modal */}
      <Modal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        title={`Propose Skill Swap with ${selectedPartner?.name}`}
      >
        {proposalSuccess ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2rem' }}>🎉</div>
            <h4 style={{ fontWeight: 700, marginTop: 'var(--space-2)' }}>Proposal Sent Successfully!</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              {selectedPartner?.name} will receive a notification to review and accept your swap proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendProposal} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <div><strong>They Teach:</strong> {selectedPartner?.teaches}</div>
              <div style={{ marginTop: '2px', color: 'var(--text-muted)' }}>Typical Availability: {selectedPartner?.availability || 'Weekends'}</div>
            </div>

            <Select
              label="Select Which of Your Skills You Will Offer in Return"
              options={myTeachingSkills.map(s => s.name)}
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
            />

            <Textarea
              label="Personalized Proposal Message"
              required
              rows={4}
              value={proposalMsg}
              onChange={(e) => setProposalMsg(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="outline" onClick={() => setSelectedPartner(null)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={sending}>Send Proposal</Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}
