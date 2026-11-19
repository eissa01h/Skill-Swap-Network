import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { StatCard } from '../../components/ui/Card/StatCard';
import { Card } from '../../components/ui/Card/Card';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Button } from '../../components/ui/Button/Button';
import {
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_REPORTS,
  MOCK_ADMIN_USERS,
} from '../../utils/mockData';

export function AdminDashboardPage() {
  return (
    <AdminLayout
      title="Platform Operations & Moderation"
      subtitle="Monitor platform safety, user behavior, report resolution, and network growth."
      actions={
        <Link to="/admin/reports">
          <Button variant="danger" size="md">
            Review Reports ({MOCK_ADMIN_STATS.pendingReports})
          </Button>
        </Link>
      }
    >
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <StatCard
          label="Total Registered Users"
          value={MOCK_ADMIN_STATS.totalUsers.toLocaleString()}
          trend="+48 this week"
          icon="👥"
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
        <StatCard
          label="Active Swaps (Monthly)"
          value={MOCK_ADMIN_STATS.activeSwapsThisMonth}
          trend="+12% growth"
          icon="🔄"
          iconBg="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          label="Total Exchanges Completed"
          value={MOCK_ADMIN_STATS.completedSwapsTotal.toLocaleString()}
          trend="100% zero-cost"
          icon="🎓"
          iconBg="#f5f3ff"
          iconColor="#7c3aed"
        />
        <StatCard
          label="Safety Resolution Rate"
          value={MOCK_ADMIN_STATS.disputeResolutionRate}
          trend="Avg response < 4 hrs"
          icon="🛡️"
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        {/* Urgent Reports Queue */}
        <Card
          title="Active Moderation Queue"
          subtitle="Reports submitted by community members requiring staff review"
          actions={
            <Link to="/admin/reports">
              <Button variant="ghost" size="sm">Full Queue →</Button>
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {MOCK_ADMIN_REPORTS.map(rep => (
              <div
                key={rep.id}
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-slate-50)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '2px' }}>
                    <strong style={{ fontSize: 'var(--font-size-sm)' }}>{rep.category}</strong>
                    <StatusBadge status={rep.status} />
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    Reported User: <strong>{rep.reportedUser.name}</strong> • Reported by: {rep.reportingUser.name}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                    "{rep.summary}"
                  </p>
                </div>
                <Link to={`/admin/reports/${rep.id}`}>
                  <Button variant="outline" size="sm">Investigate</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* User Status Snapshot */}
        <Card
          title="Recent User Accounts"
          subtitle="Latest member registrations & standing"
          actions={
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">All Users →</Button>
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {MOCK_ADMIN_USERS.map(usr => (
              <div
                key={usr.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>{usr.name}</strong>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{usr.email}</span>
                </div>
                <StatusBadge status={usr.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
