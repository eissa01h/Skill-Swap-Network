import React from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card/Card';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';

export function AdminModerationPage() {
  const auditLogs = [
    {
      id: 'log_01',
      action: 'ACCOUNT_SUSPENDED',
      target: 'Devon Watts (devon.watts@example.com)',
      moderator: 'David Sterling',
      reason: 'Commercial solicitation via Venmo/PayPal (Rule 1 violation)',
      timestamp: 'Today, 2:15 PM',
    },
    {
      id: 'log_02',
      action: 'WARNING_ISSUED',
      target: 'Tom Bradley (tom.b@example.com)',
      moderator: 'David Sterling',
      reason: 'Consecutive unexcused no-shows on scheduled sessions',
      timestamp: 'Feb 12, 2026',
    },
    {
      id: 'log_03',
      action: 'LISTING_REMOVED',
      target: 'Anonymous Trader (bot98@tempmail.com)',
      moderator: 'System Bot / Automated Filter',
      reason: 'Spam external survey URL patterns detected in description',
      timestamp: 'Feb 10, 2026',
    },
  ];

  return (
    <AdminLayout
      title="Moderation Audit Trail"
      subtitle="Complete, tamper-evident log of administrative actions, account penalties, and safety enforcements."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Card title="Recent Enforcement Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            {auditLogs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-slate-50)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--color-primary-600)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                    {log.action.replace(/_/g, ' ')}
                  </strong>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  <strong>Target:</strong> {log.target}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Moderator:</strong> {log.moderator} • <strong>Reason:</strong> {log.reason}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

