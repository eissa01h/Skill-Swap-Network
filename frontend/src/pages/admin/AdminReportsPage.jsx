import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { adminService } from '../../services/mockApi';

export function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReports();
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <AdminLayout
      title="Content & Behavior Reports"
      subtitle="Investigate community flags concerning commercial solicitation, spam, or misconduct."
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Spinner />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No open incident reports"
          description="Platform behavior is compliant with community guidelines. All reports resolved."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {reports.map(rep => (
            <Card key={rep.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{rep.category}</h3>
                    <StatusBadge status={rep.status} />
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    Report ID: <code>{rep.id}</code> • Filed on {rep.date}
                  </p>
                </div>
                <Link to={`/admin/reports/${rep.id}`}>
                  <Button variant="primary" size="sm">
                    Review Evidence & Take Action →
                  </Button>
                </Link>
              </div>

              <div style={{ margin: 'var(--space-3) 0', padding: 'var(--space-3)', backgroundColor: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Reported Account:</span>
                    <strong>{rep.reportedUser.name}</strong> ({rep.reportedUser.email})
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Reported By:</span>
                    <strong>{rep.reportingUser.name}</strong>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                  <strong>Summary:</strong> {rep.summary}
                </p>
                {rep.actionTaken && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-700)', fontWeight: 600, marginTop: 'var(--space-1)' }}>
                    Resolution Action: {rep.actionTaken}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminReportsPage;
