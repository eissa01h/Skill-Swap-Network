import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../../../utils/mockData';
import './NotificationDropdown.css';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="notif-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="notif-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
      >
        🔔
        {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)', fontWeight: 500 }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="notif-panel-body">
            {notifications.map(n => (
              <Link
                key={n.id}
                to={n.link || '/app/notifications'}
                className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', margin: 0 }}>{n.message}</p>
              </Link>
            ))}
          </div>
          <div style={{ padding: 'var(--space-2)', textAlign: 'center', backgroundColor: 'var(--color-slate-50)' }}>
            <Link
              to="/app/notifications"
              style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}
              onClick={() => setIsOpen(false)}
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

