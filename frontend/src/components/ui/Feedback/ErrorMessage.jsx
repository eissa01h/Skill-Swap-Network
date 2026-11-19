import React from 'react';
import './ErrorMessage.css';

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry = null,
  className = '',
}) {
  if (!message) return null;

  return (
    <div className={`error-banner ${className}`} role="alert">
      <span className="error-banner-icon">⚠️</span>
      <div className="error-banner-content">
        {title && <div className="error-banner-title">{title}</div>}
        <div>{message}</div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ textDecoration: 'underline', fontWeight: 600, color: 'inherit' }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

