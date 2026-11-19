import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { ProfileCard } from '../../components/ui/Card/ProfileCard';
import { Modal } from '../../components/ui/Modal/Modal';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Button } from '../../components/ui/Button/Button';
import { MOCK_SKILL_CATEGORIES } from '../../utils/mockData';

export function FindPartnersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [proposalSent, setProposalSent] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');

  const partners = [
    {
      id: 'usr_002',
      name: 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      title: 'Bilingual Translator & Tech Enthusiast',
      location: 'Austin, TX',
      rating: 5.0,
      reviewsCount: 19,
      category: 'Languages',
      teaches: 'Conversational Spanish',
      bio: 'Native Spanish speaker from Madrid now living in the US. Eager to switch careers into tech and need mentorship in React!',
    },
    {
      id: 'usr_003',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      title: 'Commercial Portrait Photographer',
      location: 'Seattle, WA',
      rating: 4.9,
      reviewsCount: 31,
      category: 'Design & Creative',
      teaches: 'Digital Photography & Lightroom',
      bio: 'Photographer with 8 years studio experience. Wanting to learn Python for automation and image sorting algorithms.',
    },
    {
      id: 'usr_004',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      title: 'Acoustic Guitarist & Singer-Songwriter',
      location: 'Nashville, TN',
      rating: 4.85,
      reviewsCount: 15,
      category: 'Music & Audio',
      teaches: 'Acoustic Guitar Fingerpicking',
      bio: 'Full-time musician teaching guitar chords and acoustic rhythm. Looking to improve keyboard accompaniment.',
    },
    {
      id: 'usr_005',
      name: 'Liam Becker',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      title: 'Senior Product Designer',
      location: 'Berlin / Remote',
      rating: 4.9,
      reviewsCount: 22,
      category: 'Design & Creative',
      teaches: 'Figma UI/UX & Design Systems',
      bio: 'Designer passionate about design tokens and component libraries. Looking to exchange for backend REST APIs.',
    },
    {
      id: 'usr_006',
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      title: 'SEO Specialist & Content Strategist',
      location: 'London, UK',
      rating: 5.0,
      reviewsCount: 14,
      category: 'Business & Marketing',
      teaches: 'Growth Marketing & Technical SEO',
      bio: 'Helps startups scale search visibility. Looking for Python mentorship to write scraper tools.',
    },
  ];

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.teaches.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendProposal = (e) => {
    e.preventDefault();
    setProposalSent(true);
    setTimeout(() => {
      setProposalSent(false);
      setSelectedPartner(null);
      setProposalMessage('');
    }, 1200);
  };

  return (
    <AppLayout
      title="Find Learning Partners"
      subtitle="Explore members by skill, category, and expertise level to propose an exchange."
    >
      {/* Search & Filter Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Input
          placeholder="Search by skill name, topic, or keyword (e.g. Spanish, Guitar, Python)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startIcon="🔍"
        />
        <Select
          options={MOCK_SKILL_CATEGORIES}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredPartners.map(partner => (
          <ProfileCard
            key={partner.id}
            user={partner}
            onProposeSwap={(user) => setSelectedPartner(user)}
            onViewProfile={(user) => alert(`Viewing full public profile for ${user.name}`)}
          />
        ))}
      </div>

      {/* Propose Swap Modal */}
      <Modal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        title={`Propose Skill Swap with ${selectedPartner?.name}`}
      >
        {proposalSent ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
            <h4 style={{ fontWeight: 700 }}>Swap Proposal Sent!</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              {selectedPartner?.name} will be notified and can accept or counter your proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendProposal} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <strong>Trading:</strong> You teach React Architecture in exchange for {selectedPartner?.teaches}.
            </div>

            <Textarea
              label="Introductory Message & Schedule Proposal"
              required
              rows={4}
              placeholder="Hi! I'd love to swap skills. I can offer 1 hour of React code mentoring every weekend in exchange for..."
              value={proposalMessage}
              onChange={(e) => setProposalMessage(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" onClick={() => setSelectedPartner(null)}>
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
