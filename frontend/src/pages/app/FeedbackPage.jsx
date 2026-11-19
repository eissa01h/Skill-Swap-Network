import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Select } from '../../components/ui/Select/Select';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { reviewService } from '../../services/mockApi';

export function FeedbackPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newReview, setNewReview] = useState({
    partner: 'Carlos Rodriguez',
    skill: 'Conversational Spanish',
    rating: 5,
    comment: '',
  });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviews();
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      setErrorMsg('Please enter feedback before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await reviewService.submitReview(newReview);
      await loadReviews();
      setNewReview({
        partner: 'Carlos Rodriguez',
        skill: 'Conversational Spanish',
        rating: 5,
        comment: '',
      });
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Ratings & Reviews"
      subtitle="Verified post-swap peer testimonials building trust in the community."
      actions={
        <Button variant="primary" size="md" onClick={() => { setErrorMsg(''); setModalOpen(true); }}>
          ⭐ Leave a Review
        </Button>
      }
    >
      {/* Reputation Summary Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) var(--space-6)',
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 'var(--space-6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ fontSize: '2rem' }}>⭐</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{averageRating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>out of 5.0</span>
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Based on {reviews.length} verified peer exchanges
            </div>
          </div>
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-700)', backgroundColor: 'var(--color-primary-50)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          ✓ 100% Peer Verified Community
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Complete your first skill exchange lesson to receive peer feedback."
          actionText="Find a Partner"
          onAction={() => window.location.href = '/app/find-partners'}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {reviews.map(rev => (
            <Card key={rev.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <img
                  src={rev.authorAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                  alt={rev.authorName}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{rev.authorName}</h4>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                    Skill: {rev.skillTaught}
                  </div>
                </div>
                <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: '#f59e0b' }}>
                  ⭐ {rev.rating}.0
                </div>
              </div>

              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
                "{rev.comment}"
              </p>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                Verified Session • {rev.date}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Leave Review Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Swap Feedback"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {errorMsg && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
              {errorMsg}
            </div>
          )}

          <Select
            label="Swap Partner to Review"
            options={['Carlos Rodriguez', 'Elena Rostova', 'Marcus Vance']}
            value={newReview.partner}
            onChange={(e) => setNewReview({ ...newReview, partner: e.target.value })}
          />

          <Select
            label="Rating (1 to 5 Stars)"
            options={[
              { value: 5, label: '⭐⭐⭐⭐⭐ — 5 Stars (Exceptional)' },
              { value: 4, label: '⭐⭐⭐⭐ — 4 Stars (Very Good)' },
              { value: 3, label: '⭐⭐⭐ — 3 Stars (Satisfactory)' },
              { value: 2, label: '⭐⭐ — 2 Stars (Needs Improvement)' },
              { value: 1, label: '⭐ — 1 Star (Unsatisfactory)' },
            ]}
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          />

          <Textarea
            label="Detailed Feedback & Recommendation"
            required
            rows={4}
            placeholder="How was your partner's punctuality, teaching clarity, and preparation?"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default FeedbackPage;
