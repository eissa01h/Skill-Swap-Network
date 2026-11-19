import React from 'react';
import './StatusBadge.css';

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = status.toLowerCase();
  let variantClass = 'status-neutral';

  if (['pending', 'in_progress', 'scheduled'].includes(normalized)) {
    variantClass = 'status-pending';
  } else if (['accepted', 'active', 'confirmed'].includes(normalized)) {
    variantClass = 'status-accepted';
  } else if (['completed', 'resolved'].includes(normalized)) {
    variantClass = 'status-completed';
  } else if (['declined', 'cancelled', 'blocked', 'rejected'].includes(normalized)) {
    variantClass = 'status-declined';
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span className={`status-badge ${variantClass} ${className}`}>
      <span className="status-dot" />
      <span>{label}</span>
    </span>
  );
}
