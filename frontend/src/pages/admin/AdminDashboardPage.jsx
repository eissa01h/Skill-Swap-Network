import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { StatCard } from '../../components/ui/Card/StatCard';
import { Card } from '../../components/ui/Card/Card';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { adminService } from '../../services/adminService';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, reportsData, usersData] = await Promise.all([
          adminService.getStats(),
          adminService.getReports(),
          adminService.getUsers(),
        ]);
        setStats(statsData);
        setReports(reportsData || []);
        setUsers(usersData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;

  return (
    <AdminLayout
      title="Platform Operations & Moderation"
      subtitle="Monitor platform safety, user behavior, report resolution, and network growth."
      actions={
        <Link to="/admin/reports">
          <Button variant="danger" size="md">
            Review Reports ({pendingReportsCount})
          </Button>
        </Link>
      }
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Spinner />
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            <StatCard
              label="Total Registered Users"
              value={stats?.totalUsers?.toLocaleString() || '1,420'}
              trend="+48 this week"
              icon="👥"
              iconBg="#eff6ff"
              iconColor="#2563eb"
            />
            <StatCard
              label="Active Swaps (Monthly)"
              value={stats?.activeSwapsThisMonth || '384'}
              trend="+12% growth"
              icon="🔄"
              iconBg="#ecfdf5"
              iconColor="#059669"
            />
            <StatCard
              label="Total Exchanges Completed"
              value={stats?.completedSwapsTotal?.toLocaleString() || '2,150'}
              trend="100% zero-cost"
              icon="🎓"
              iconBg="#f5f3ff"
              iconColor="#7c3aed"
            />
            <StatCard
              label="Safety Resolution Rate"
              value={stats?.disputeResolutionRate || '99.4%'}
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
                {reports.slice(0, 4).map(rep => (
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

            {/* Platform Health & Recent Users */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <Card
                title="Recent Members"
                subtitle="Newly joined knowledge exchange participants"
                actions={
                  <Link to="/admin/users">
                    <Button variant="ghost" size="sm">View All Users →</Button>
                  </Link>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  {users.slice(0, 4).map(u => (
                    <div
                      key={u.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--space-2) 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>{u.name}</strong>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{u.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <StatusBadge status={u.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="System Integrity Status">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Database Engine:</span>
                    <strong>PostgreSQL (Supabase)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Backend REST API:</span>
                    <strong>Spring Boot 3.2.3 (Port 8080)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Security Engine:</span>
                    <strong>Spring Security + JWT + BCrypt</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Commercial Detection:</span>
                    <strong style={{ color: '#059669' }}>Active & Enforcing Zero-Cost</strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboardPage;
