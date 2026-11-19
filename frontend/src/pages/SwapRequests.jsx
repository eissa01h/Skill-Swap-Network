import React from 'react';
import { Card } from '../components/common/Card';

export function SwapRequests() {
  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>My Swap Requests</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track incoming and outgoing skill exchange proposals and manage active sessions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card title="Incoming Requests" subtitle="Proposals from peers wishing to swap skills">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            No pending incoming requests at this moment.
          </p>
        </Card>

        <Card title="Outgoing Proposals" subtitle="Proposals you sent to other users">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            No active outgoing proposals at this moment.
          </p>
        </Card>
      </div>
    </div>
  );
}
