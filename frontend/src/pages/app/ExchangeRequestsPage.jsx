import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Modal } from '../../components/ui/Modal/Modal';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { swapService } from '../../services/swapService';

export function ExchangeRequestsPage() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const [inc, out] = await Promise.all([
        swapService.getIncomingRequests(),
        swapService.getOutgoingRequests(),
      ]);
      setIncoming(inc);
      setOutgoing(out);
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = async (id) => {
    await swapService.acceptRequest(id);
    await loadRequests();
    if (selectedDetail?.id === id) {
      setSelectedDetail(null);
    }
  };

  const handleDecline = async (id) => {
    await swapService.declineRequest(id);
    await loadRequests();
    if (selectedDetail?.id === id) {
      setSelectedDetail(null);
    }
  };

  const handleCancel = async (id) => {
    await swapService.cancelRequest(id);
    await loadRequests();
    if (selectedDetail?.id === id) {
      setSelectedDetail(null);
    }
  };

  return (
    <AppLayout
      title="Skill Exchange Proposals"
      subtitle="Review incoming swap requests from learning partners or track outgoing proposals you have initiated."
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('incoming')}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: activeTab === 'incoming' ? 'var(--color-primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'incoming' ? '2px solid var(--color-primary-600)' : '2px solid transparent',
            marginBottom: '-1px',
            cursor: 'pointer',
          }}
        >
          Incoming Proposals ({incoming.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('outgoing')}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: activeTab === 'outgoing' ? 'var(--color-primary-600)' : 'var(--text-muted)',
            borderBottom: activeTab === 'outgoing' ? '2px solid var(--color-primary-600)' : '2px solid transparent',
            marginBottom: '-1px',
            cursor: 'pointer',
          }}
        >
          Sent Proposals ({outgoing.length})
        </button>
      </div>

      {loading ? (
        <Spinner size="lg" message="Loading swap proposals..." />
      ) : activeTab === 'incoming' ? (
        incoming.length === 0 ? (
          <EmptyState
            icon="📩"
            title="No Incoming Proposals Yet"
            description="When members discover your skills and propose an exchange, you will review their requests here."
            actionLabel="Explore Community Directory"
            onAction={() => window.location.href = '/app/find-partners'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {incoming.map(req => (
              <Card key={req.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img
                      src={req.sender.avatar}
                      alt={req.sender.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{req.sender.name}</h4>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        {req.sender.location} • Received {req.date}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
                  <div><strong>They Offer to Teach:</strong> {req.theyOffer}</div>
                  <div style={{ marginTop: '2px' }}><strong>Requested in Return:</strong> {req.theyWant}</div>
                  <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                    Proposed Cadence: {req.proposedSchedule}
                  </div>
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>
                  "{req.message}"
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDetail(req)}>
                    View Full Request Details →
                  </Button>

                  {req.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button variant="outline" size="sm" onClick={() => handleDecline(req.id)}>
                        Decline
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleAccept(req.id)}>
                        Accept Proposal
                      </Button>
                    </div>
                  ) : req.status === 'ACCEPTED' ? (
                    <Link to="/app/messages">
                      <Button variant="primary" size="sm">Chat & Schedule Session</Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        outgoing.length === 0 ? (
          <EmptyState
            icon="📤"
            title="No Sent Proposals"
            description="You haven't sent any swap proposals yet. Discover a partner and propose your first swap!"
            actionLabel="Find Partners Now"
            onAction={() => window.location.href = '/app/find-partners'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {outgoing.map(req => (
              <Card key={req.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img
                      src={req.recipient.avatar}
                      alt={req.recipient.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{req.recipient.name}</h4>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Sent {req.date}</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
                  <div><strong>You Offered:</strong> {req.youOffer}</div>
                  <div style={{ marginTop: '2px' }}><strong>You Requested:</strong> {req.youWant}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDetail(req)}>
                    View Request Details →
                  </Button>

                  {req.status === 'PENDING' && (
                    <Button variant="danger" size="sm" onClick={() => handleCancel(req.id)}>
                      Cancel Pending Request
                    </Button>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <Link to="/app/messages">
                      <Button variant="primary" size="sm">Open Discussion</Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Request Details Modal */}
      <Modal
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
        title="Exchange Proposal Details"
      >
        {selectedDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Proposal ID: {selectedDetail.id}</span>
              <StatusBadge status={selectedDetail.status} />
            </div>

            <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
              <div><strong>Teaching Offering:</strong> {selectedDetail.theyOffer || selectedDetail.youOffer}</div>
              <div style={{ marginTop: '4px' }}><strong>Learning Topic:</strong> {selectedDetail.theyWant || selectedDetail.youWant}</div>
              <div style={{ marginTop: '4px' }}><strong>Proposed Schedule:</strong> {selectedDetail.proposedSchedule || '1 hour weekly'}</div>
            </div>

            <div>
              <strong style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Introductory Message:</strong>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic', padding: 'var(--space-3)', borderLeft: '3px solid var(--color-primary-600)', background: 'var(--bg-app)' }}>
                "{selectedDetail.message}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {selectedDetail.status === 'PENDING' && selectedDetail.theyOffer && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleDecline(selectedDetail.id)}>
                    Decline
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleAccept(selectedDetail.id)}>
                    Accept Proposal
                  </Button>
                </>
              )}
              {selectedDetail.status === 'PENDING' && selectedDetail.youOffer && (
                <Button variant="danger" size="sm" onClick={() => handleCancel(selectedDetail.id)}>
                  Cancel Request
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
