import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { swapService } from '../../services/mockApi';

export function MyExchangesPage() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExchanges = async () => {
    try {
      setLoading(true);
      const data = await swapService.getActiveExchanges();
      setExchanges(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  const handleComplete = async (id) => {
    try {
      await swapService.completeExchange(id);
      await loadExchanges();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout
      title="My Skill Exchanges"
      subtitle="Track your active and completed peer knowledge exchanges."
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Spinner />
        </div>
      ) : exchanges.length === 0 ? (
        <EmptyState
          title="No active skill exchanges yet"
          description="When you and another member accept an exchange proposal, your progress will appear here."
          actionText="Find Exchange Partners"
          onAction={() => window.location.href = '/app/find-partners'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {exchanges.map(exc => {
            const progressPercent = Math.min(
              100,
              Math.round(((exc.sessionsCompleted || 0) / (exc.totalSessionsPlanned || 1)) * 100)
            );

            return (
              <Card key={exc.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <img
                      src={exc.partner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                      alt={exc.partner?.name || 'Partner'}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Exchange with {exc.partner?.name}</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                        You teach: <strong>{exc.skillYouTeach}</strong> ⇄ You learn: <strong>{exc.skillYouLearn}</strong>
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={exc.status} />
                </div>

                {/* Progress Bar */}
                <div style={{ margin: 'var(--space-6) 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    <span>Session Progress: {exc.sessionsCompleted} of {exc.totalSessionsPlanned} Completed</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-slate-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--color-accent-500)', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                  <span><strong>Next Meeting:</strong> {exc.nextSession}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{exc.notes}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <Link to="/app/messages">
                    <Button variant="outline" size="sm">💬 Chat Partner</Button>
                  </Link>
                  <Link to="/app/schedule">
                    <Button variant="outline" size="sm">📅 View Schedule</Button>
                  </Link>
                  {exc.status === 'ACTIVE' && (
                    <Button variant="primary" size="sm" onClick={() => handleComplete(exc.id)}>
                      ✓ Mark as Completed
                    </Button>
                  )}
                  {exc.status === 'COMPLETED' && (
                    <Link to="/app/feedback">
                      <Button variant="primary" size="sm">⭐ Submit Rating & Feedback</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}

export default MyExchangesPage;
