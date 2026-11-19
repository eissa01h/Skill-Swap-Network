import React from 'react';

export function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: 'var(--spacing-8) 0',
      marginTop: 'auto',
      color: 'var(--text-muted)',
      fontSize: 'var(--font-size-sm)',
      textAlign: 'center'
    }}>
      <div className="container">
        <p>© 2026 Skill Swap Network. Free, peer-to-peer knowledge exchange.</p>
        <p style={{ marginTop: 'var(--spacing-2)' }}>Software Engineering Project • Three-Layer Architecture</p>
      </div>
    </footer>
  );
}

