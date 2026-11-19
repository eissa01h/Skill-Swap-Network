import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { adminService } from '../../services/mockApi';

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // 'BLOCK' or 'UNBLOCK'

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmToggle = async () => {
    if (!selectedUser || !actionType) return;

    try {
      await adminService.toggleUserBlock(selectedUser.id);
      await loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  return (
    <AdminLayout
      title="User Management"
      subtitle="Inspect member accounts, review listed skills, and block/unblock users adhering to community standards."
    >
      <div style={{ maxWidth: '400px', marginBottom: 'var(--space-6)' }}>
        <Input
          placeholder="Search by name or email address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startIcon="🔍"
        />
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <Spinner />
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No members match search"
            description={`No users matching "${searchTerm}" found in the directory.`}
            actionText="Clear Filter"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                  <th style={{ padding: 'var(--space-3)' }}>Member</th>
                  <th style={{ padding: 'var(--space-3)' }}>Rating</th>
                  <th style={{ padding: 'var(--space-3)' }}>Skills Listed</th>
                  <th style={{ padding: 'var(--space-3)' }}>Swaps</th>
                  <th style={{ padding: 'var(--space-3)' }}>Status</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{u.name}</strong>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>⭐ {u.rating}</td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>{u.skillsCount} skills</td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>{u.swapsCount}</td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', textAlign: 'right' }}>
                      {u.status === 'ACTIVE' ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(u);
                            setActionType('BLOCK');
                          }}
                        >
                          Block Account
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(u);
                            setActionType('UNBLOCK');
                          }}
                        >
                          Unblock
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedUser}
        title={actionType === 'BLOCK' ? 'Block User Account?' : 'Unblock User Account?'}
        message={
          actionType === 'BLOCK'
            ? `Are you sure you want to block ${selectedUser?.name}? They will immediately lose access to swap messaging, proposals, and public listings.`
            : `Restore full platform privileges for ${selectedUser?.name}?`
        }
        confirmText={actionType === 'BLOCK' ? 'Block Account' : 'Unblock Account'}
        confirmVariant={actionType === 'BLOCK' ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggle}
        onCancel={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
      />
    </AdminLayout>
  );
}

export default AdminUsersPage;
