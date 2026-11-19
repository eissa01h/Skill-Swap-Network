import React from 'react';
import './EmptyState.css';
import { Button } from '../Button/Button';

export function EmptyState({
  icon = '🔍',
  title = 'No Items Found',
  description = 'There are currently no records to display.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

