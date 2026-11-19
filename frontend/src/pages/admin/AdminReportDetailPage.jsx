import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { MOCK_ADMIN_REPORTS } from '../../utils/mockData';

export function AdminReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = MOCK_ADMIN_REPORTS.find(r => r.id === id) || MOCK_ADMIN_REPORTS[0];

  const [status, setStatus] = useState(report.status);
  const [actionNotice, setActionNotice] = useState(null);

  const handleAction = (type) => {
    setStatus('RESOLVED');
    if (type === 'BAN') {
      setActionNotice(`User ${report.reportedUser.name} has been banned and their listings removed.`);
    } else if (type === 'WARN') {
      setActionNotice(`Official warning sent to ${report.reportedUser.name}.`);
    } else {
      setActionNotice('Report has been reviewed and dismissed.');
    }
  };

  return (
    <AdminLayout
      title={`Incident Investigation: ${report.category}`}
      subtitle={`Detailed evidence review for Case ${report.id}`}
      actions={
        <Link to="/admin/reports">
          <Button variant="outline" size="sm">← Back to Queue</Button>
        </Link>
      }
    >
      <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {actionNotice && (
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            ✓ {actionNotice}
          </div>
        )}

        {/* Overview Card */}
        <Card title="Case Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Standing</span>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge status={status} />
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filed Date</span>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>{report.date}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reported Account</span>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                {report.reportedUser.name} ({report.reportedUser.email})
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reporting Member</span>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                {report.reportingUser.name}
              </p>
            </div>
          </div>
        </Card>

        {/* Evidence & Logs */}
        <Card title="Reported Evidence & Statements">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <div>
              <strong style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Complainant Summary:
              </strong>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {report.summary}
              </p>
            </div>

            <div>
              <strong style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Attached Transcripts / Artifacts:
              </strong>
              <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-4)', backgroundColor: 'var(--color-slate-900)', color: '#34d399', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', lineHeight: 1.6 }}>
                {report.evidence || 'No direct chat transcript logged.'}
              </div>
            </div>
          </div>
        </Card>

        {/* Moderation Actions */}
        <Card title="Moderation Enforcement Action">
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
            Enforcing an action updates the user's standing and logs an audit record.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Button variant="danger" onClick={() => handleAction('BAN')}>
              🚫 Ban & Block Account
            </Button>
            <Button variant="outline" onClick={() => handleAction('WARN')}>
              ⚠️ Send Formal Warning
            </Button>
            <Button variant="ghost" onClick={() => handleAction('DISMISS')}>
              Dismiss Case (No Violation)
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
