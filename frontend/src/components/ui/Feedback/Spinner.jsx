import React from 'react';
import './Spinner.css';

export function Spinner({
  size = 'md',
  message = null,
  className = '',
}) {
  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner-circle spinner-${size}`} role="status" aria-label="Loading" />
      {message && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{message}</p>}
    </div>
  );
}
