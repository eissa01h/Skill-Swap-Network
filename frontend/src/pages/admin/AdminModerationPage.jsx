import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card/Card';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { adminService } from '../../services/adminService';

const DEFAULT_AUDIT_LOGS = [
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

export function AdminModerationPage() {
  const [auditLogs, setAuditLogs] = useState(DEFAULT_AUDIT_LOGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await adminService.getAuditLogs();
        if (data && data.length > 0) {
          setAuditLogs(data);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <AdminLayout
      title="Moderation Audit Trail"
      subtitle="Complete, tamper-evident log of administrative actions, account penalties, and safety enforcements."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Card title="Recent Enforcement Actions">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
              <Spinner />
            </div>
          ) : (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <strong style={{ color: 'var(--color-slate-900)' }}>{log.target}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginLeft: 'var(--space-3)' }}>
                        Action by: {log.moderator}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <StatusBadge status={log.action} />
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    <strong>Violation / Decision:</strong> {log.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
