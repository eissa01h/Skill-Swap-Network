import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { MOCK_EXCHANGE_REQUESTS } from '../../utils/mockData';

export function ExchangeRequestsPage() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState(MOCK_EXCHANGE_REQUESTS.incoming);
  const [outgoing, setOutgoing] = useState(MOCK_EXCHANGE_REQUESTS.outgoing);

  const handleAccept = (id) => {
    setIncoming(incoming.map(req => req.id === id ? { ...req, status: 'ACCEPTED' } : req));
  };

  const handleDecline = (id) => {
    setIncoming(incoming.map(req => req.id === id ? { ...req, status: 'DECLINED' } : req));
  };

  const handleCancel = (id) => {
    setOutgoing(outgoing.map(req => req.id === id ? { ...req, status: 'CANCELLED' } : req));
  };

  return (
    <AppLayout
      title="Exchange Proposals"
      subtitle="Manage incoming and outgoing skill swap requests."
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
          }}
        >
          Sent Proposals ({outgoing.length})
        </button>
      </div>

      {activeTab === 'incoming' ? (
        incoming.length === 0 ? (
          <EmptyState title="No incoming proposals" description="When other members request a swap with you, their requests will appear here." />
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
                  <div><strong>They Offer:</strong> {req.theyOffer}</div>
                  <div style={{ marginTop: '2px' }}><strong>In Exchange For:</strong> {req.theyWant}</div>
                  <div style={{ marginTop: '2px', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                    Cadence: {req.proposedSchedule}
                  </div>
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>
                  "{req.message}"
                </p>

                {req.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <Button variant="outline" size="sm" onClick={() => handleDecline(req.id)}>
                      Decline
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleAccept(req.id)}>
                      Accept Proposal
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      ) : (
        outgoing.length === 0 ? (
          <EmptyState title="No sent proposals" description="You haven't initiated any swap requests yet." />
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
                  <div style={{ marginTop: '2px' }}><strong>Requested In Return:</strong> {req.youWant}</div>
                </div>

                {req.status === 'PENDING' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="danger" size="sm" onClick={() => handleCancel(req.id)}>
                      Withdraw Proposal
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      )}
    </AppLayout>
  );
}
