import React from 'react';

export function Card({ title, subtitle, children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-6)',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      {title && <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-1)' }}>{title}</h3>}
      {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)' }}>{subtitle}</p>}
      {children}
    </div>
  );
}
