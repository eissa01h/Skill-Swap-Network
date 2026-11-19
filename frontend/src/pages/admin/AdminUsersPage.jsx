import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { MOCK_ADMIN_USERS } from '../../utils/mockData';

export function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // 'BLOCK' or 'UNBLOCK'

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmToggle = () => {
    if (!selectedUser || !actionType) return;

    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: actionType === 'BLOCK' ? 'BLOCKED' : 'ACTIVE',
        };
      }
      return u;
    }));

    setSelectedUser(null);
    setActionType(null);
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
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onConfirm={handleConfirmToggle}
        title={actionType === 'BLOCK' ? 'Block User Account' : 'Restore User Account'}
        message={
          actionType === 'BLOCK'
            ? `Are you sure you want to suspend ${selectedUser?.name}? They will be prevented from sending new swap proposals or messaging peers.`
            : `Are you sure you want to unblock ${selectedUser?.name}? Their access will be restored.`
        }
        confirmText={actionType === 'BLOCK' ? 'Confirm Suspension' : 'Confirm Restoration'}
        confirmVariant={actionType === 'BLOCK' ? 'danger' : 'secondary'}
      />
    </AdminLayout>
  );
}
