import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { MOCK_NOTIFICATIONS } from '../../utils/mockData';

export function NotificationsPage() {
  const getStoredNotifications = () => {
    try {
      const stored = localStorage.getItem('ssn_notifications');
      return stored ? JSON.parse(stored) : MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  };

  const [notifications, setNotifications] = useState(getStoredNotifications);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    try {
      localStorage.setItem('ssn_notifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('ssn_notifications_updated'));
    } catch {
      // ignore
    }
  };

  const markOneRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    try {
      localStorage.setItem('ssn_notifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('ssn_notifications_updated'));
    } catch {
      // ignore
    }
  };

  return (
    <AppLayout
      title="Notifications Center"
      subtitle="Stay informed about incoming swap proposals, accepted agreements, and peer reviews."
      actions={
        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark All as Read
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            className="card-surface"
            style={{
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: !n.isRead ? '#f5f3ff' : 'var(--bg-surface)',
              borderColor: !n.isRead ? 'var(--color-primary-200)' : 'var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {n.type === 'SWAP_REQUEST' ? '📩' : n.type === 'SWAP_ACCEPTED' ? '🎉' : '⭐'}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <strong style={{ fontSize: 'var(--font-size-sm)' }}>{n.title}</strong>
                  {!n.isRead && (
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-600)', color: '#fff', fontWeight: 700 }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Link to={n.link}>
                <Button variant="primary" size="sm" onClick={() => markOneRead(n.id)}>
                  View Action
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

